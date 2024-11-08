import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
}