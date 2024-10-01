import React, { useState } from 'react'
import * as xlsx from "xlsx"
import { CatalogueImport } from '../model/ImportType/CatalogueImport'

type Props = {
  onDataImport: (data: CatalogueImport) => void
}

const FileUploader = ({ onDataImport }: Props) => {

  const [file, setFile] = useState<File | null>(null);
  //const [excelFile, setExcelFile] = useState<ArrayBuffer | null>(null)
  const [isValidFile, setIsValidFile] = useState<boolean>(false);

  const supportedFileTypes = ['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv'];

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) { return; }
    if (event.target.files.length <= 0) { return; }

    const file: File = event.target.files[0];
    setFile(file);

    const isValid: boolean = supportedFileTypes.includes(file.type);
    setIsValidFile(isValid);
    if (isValid) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        if (e.target && e.target.result instanceof ArrayBuffer) {
          //setExcelFile(e.target.result);
          handleFileSubmit(e.target.result);
        }
      }
    }

    console.log(file.type);
  };

  const handleFileSubmit = (excelFile: ArrayBuffer) => {
    const workbook = xlsx.read(excelFile, {type: 'buffer'});

    const samplesWorksheet = workbook.Sheets[workbook.SheetNames[0]];
    const wineriesWorksheet = workbook.Sheets[workbook.SheetNames[1]];
    const samples = xlsx.utils.sheet_to_json(samplesWorksheet) as object[];
    const wineries = xlsx.utils.sheet_to_json(wineriesWorksheet) as object[];
    onDataImport({ samples, wineries})
    //setExcelData(data.slice(0,10));
  }

   /**
   * Get the current state of the file.
   * @returns {number} - The state of the file:
   * 0 - No file selected
   * 1 - Valid file selected
   * 2 - Invalid file selected
   */
   const getFileState = (): number => {
    if (!file) return 0;
    return isValidFile ? 1 : 2;
  };

  return (
    <div>
      <div className={`
        rounded-md border-large px-4 py-2 my-2
        ${getFileState() == 0 ? 'bg-warning-100 border-warning-400' : getFileState() == 1 ? 'bg-success-100 border-success-400' : 'bg-danger-100 border-danger-400'}`
      }>
        {getFileState() == 0 ? 'Please upload valid file' : getFileState() == 1 ? 'Valid file uploaded' : 'Invalid file uploaded'}
      </div> 
      <input
        type="file"
        onChange={handleFileChange}
      >
      </input>
    </div>
  )
}

export default FileUploader