import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

export class ExcelExporter {

    private static saveWorkbook(workbook: XLSX.WorkBook, fileName: string) {
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `${fileName}.xlsx`);
    }

    static exportToExcel<T>(data: T[], fileName: string) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        this.saveWorkbook(workbook, fileName);
    }

    static exportToExcelByCategory<T>(data: T[], fileName: string, categoryKey: keyof T) {
        const workbook = XLSX.utils.book_new();     
        const categories = Array.from(new Set(data.map(item => item[categoryKey])));

        categories.forEach(category => {
            const sheetName = (category as string) == undefined ? "no_category" : category as string;

            const filteredData = data.filter(item => item[categoryKey] === category);
            const worksheet = XLSX.utils.json_to_sheet(filteredData);
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.toString());
        });

        this.saveWorkbook(workbook, fileName);  
    }

    static async exportToExcelByCategoryFormatted<T extends Record<string, unknown>>(data: T[], fileName: string, categoryKey: keyof T) {
        console.log(categoryKey);
        try {
            // Fetch the template file from the public folder
            const response = await fetch(`/rating_tables/kounice_vertical.xlsx`);
            if (!response.ok) {
                throw new Error(`Failed to fetch template file: ${response.statusText}`);
            }

            // Read the template file as a Blob
            const arrayBuffer = await response.arrayBuffer();

            // Load the workbook using ExcelJS
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);

             // Iterate through all sheets to ensure styles are preserved
             workbook.eachSheet((worksheet) => {
                worksheet.eachRow((row) => {
                    row.eachCell((cell) => {
                        // Ensure styles like borders, fills, fonts, etc., are preserved
                        const originalStyle = cell.style;
                        cell.style = { ...originalStyle };
                    });
                });
            });

            // Get the first worksheet in the template
            const worksheet = workbook.worksheets[0];
            if (!worksheet) {
                throw new Error("Template file does not contain any worksheets.");
            }
            const startRow = 12;
            // Write data into the worksheet starting from the specified row
            const selectedCols: (keyof T)[] = ["name", "wineName", "year", "note"]
            
            data.forEach((item, index) => {
                console.log(Object.keys(item));
                const row = worksheet.getRow(startRow + index); // Start writing from the specified row
                selectedCols.forEach((columnKey, colIndex) => {
                    const cell = row.getCell(colIndex + 1); // Columns are 1-based in ExcelJS
                    cell.value = item[columnKey] as ExcelJS.CellValue;

                    // Optionally, copy styles from the row above (if needed)
                    if (startRow > 1) {
                        const templateRow = worksheet.getRow(startRow - 1);
                        const templateCell = templateRow.getCell(colIndex + 1);
                        if (templateCell && templateCell.style) {
                            cell.style = { ...templateCell.style };
                        }
                    }
                });
                row.commit(); // Commit the row to apply changes
            });


            // Save the workbook as a new file
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `${fileName}.xlsx`);
        } catch (error) {
            console.error("Error copying and downloading template:", error);
        }
    }
}