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
            const response = await fetch(`/public/rating_tables/kounice_vertical.xlsx`);
            if (!response.ok) {
                throw new Error(`Failed to fetch template file: ${response.statusText}`);
            }

            // Read the template file as a Blob
            const arrayBuffer = await response.arrayBuffer();

            // Load the workbook using ExcelJS
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);

            // Get the first worksheet in the template
            const templateWorksheet = workbook.worksheets[0];
            if (!templateWorksheet) {
                throw new Error("Template file does not contain any worksheets.");
            }

            const startRow = 12;
            // Write data into the worksheet starting from the specified row
            const selectedCols: (keyof T)[] = ["name", "wineName", "year", "note"]

            const categories = Array.from(new Set(data.map(item => item[categoryKey])));

            categories.forEach(category => {
                const sheetName = (category as string) == undefined ? "no_category" : category as string;

                // Create a copy of the worksheet for further iterations if needed
                const newWorksheet = workbook.addWorksheet(sheetName.toString(), { state: 'visible' });
                newWorksheet.model = { 
                    ...templateWorksheet.model, 
                    name: sheetName.toString() 
                };

                // Merging cells manually
                for (let col = 7; col <= 15; col++) { // Columns G (7) to O (15)
                    const startCell = newWorksheet.getCell(2, col); // Start cell (row 2)
                    const endCell = newWorksheet.getCell(4, col); // End cell (row 4)
                    newWorksheet.mergeCells(startCell.address, endCell.address); // Merge cells in the range
                }
                newWorksheet.mergeCells('P1:P4');
                newWorksheet.mergeCells('Q1:Q10');
                for (let row = 5; row <= 11; row++) {
                    const startCell = newWorksheet.getCell(row, 4);
                    const endCell = newWorksheet.getCell(row, 6);
                    newWorksheet.mergeCells(startCell.address, endCell.address);
                }
                newWorksheet.mergeCells('G1:H1');
                newWorksheet.mergeCells('I1:K1');
                newWorksheet.mergeCells('L1:O1');
    
                const filteredData = data.filter(item => item[categoryKey] === category);
                filteredData.forEach((item, index) => {
                    const row = newWorksheet.getRow(startRow + index); // Start writing from the specified row
                    selectedCols.forEach((columnKey, colIndex) => {
                        const cell = row.getCell(colIndex + 1); // Columns are 1-based in ExcelJS
                        cell.value = item[columnKey] as ExcelJS.CellValue;
    
                        // Optionally, copy styles from the row above (if needed)
                        // if (startRow > 1) {
                        //     const templateRow = newWorksheet.getRow(startRow - 1);
                        //     const templateCell = templateRow.getCell(colIndex + 1);
                        //     if (templateCell && templateCell.style) {
                        //         cell.style = { ...templateCell.style };
                        //     }
                        // }
                    });
                    row.commit(); // Commit the row to apply changes
                });
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