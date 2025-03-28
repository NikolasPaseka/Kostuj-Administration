import React, { useCallback } from 'react'
import { getNestedValue } from '../getNestedValues';
import { ArrowDownIcon, EyeIcon } from '@heroicons/react/24/solid';
import { Commission } from '../../../model/Domain/Commission';

const useCommissionTableRender = () => {

  const tableColumns = [
    {name: "Commission Number", uid: "commissionNumber"},
    {name: "Number of samples", uid: "numberOfSamples"},
    {name: "Assigned user", uid: "assignedUser"},
    {name: "QR Code", uid: "qrCode"},
  ];

  const renderCell = useCallback((commission: Commission, columnKey: React.Key) => {
    const cellValue = getNestedValue(commission, columnKey as string);

    switch (columnKey) {
      case "qrCode":
        return (
          <div className="flex items-center gap-2">
          {/* Button to show QR code */}
          <button
            onClick={() => {}}
            className="p-2 rounded bg-gray-200 hover:bg-gray-300"
            title="Show QR Code"
          >
            <EyeIcon className="w-5 h-5 text-gray-700" />
          </button>

          {/* Button to download PNG */}

          <a href='https://pngimg.com/d/qr_code_PNG33.png' download>
          <button
            onClick={() => {}}
            className="p-2 rounded bg-gray-200 hover:bg-gray-300"
            title="Download PNG"
          >
            <ArrowDownIcon className="w-5 h-5 text-gray-700" />
          </button></a>
        </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return { renderCell, tableColumns };
};

export default useCommissionTableRender