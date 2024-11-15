import React, { useCallback } from 'react'
import { getNestedValue } from '../getNestedValues';
import { EyeIcon } from '@heroicons/react/24/solid';
import { PencilIcon } from '@heroicons/react/24/solid';
import { TrashIcon } from '@heroicons/react/24/solid';
import { Winery } from '../../../model/Winery';
import { Tooltip, User } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { TranslationNS } from '../../../translations/i18n';

type UseRenderCellProps = {
    setWineryToEdit: (winery: Winery) => void;
    setWineryToRemove: (winery: Winery) => void;
    onDeleteModalOpen: () => void;
    showSmallerVersion?: boolean;
};

const useWineryTableRender = ({ setWineryToEdit, setWineryToRemove, onDeleteModalOpen, showSmallerVersion=false }: UseRenderCellProps) => {

  const { t } = useTranslation();

  const tableColumns = [
    {name: t("winery", { ns: TranslationNS.catalogues }), uid: "name"},
    {name: t("placeAndAddress", { ns: TranslationNS.catalogues }), uid: "address"},
    {name: t("emailAddress", { ns: TranslationNS.catalogues }), uid: "email"},
    ...(showSmallerVersion ? [] : [
        {name: t("phoneNumber", { ns: TranslationNS.catalogues }), uid: "phoneNumber"},
        {name: t("website", { ns: TranslationNS.catalogues }), uid: "websitesUrl"},
        {name: t("actions", { ns: TranslationNS.common }), uid: "actions"}
      ])
  ];

  const renderCell = useCallback((winery: Winery, columnKey: React.Key) => {
    const cellValue = getNestedValue(winery, columnKey as string);

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{radius: "lg", src: winery.imageUrl}}
            description={""}
            name={cellValue}
          >
            {winery.name}
          </User>
        );
      case "websitesUrl":
        return (
          <div className="w-64">
            <a href={cellValue} target="_blank" rel="noreferrer" className="text-red-500 break-all">
            {cellValue}
            </a>
          </div>
  
        );
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <span className="cursor-pointer">
              <Tooltip content="Details">
                  <EyeIcon className='w-5 h-5 text-gray-600' />
              </Tooltip>
            </span>
            <span 
              onClick={() => {
                setWineryToEdit({ ...winery });
              }}
              className="cursor-pointer">
              <Tooltip content="Edit">
                  <PencilIcon className='w-5 h-5 text-gray-600' />
              </Tooltip>
            </span>
            <span onClick={() => {
              setWineryToRemove(winery);
              onDeleteModalOpen() ;
            }} className="cursor-pointer">
              <Tooltip color="danger" content="Delete">
                  <TrashIcon className='w-5 h-5 text-danger' />
              </Tooltip>
            </span>
          </div>
        );
      default:
        return cellValue;
    }
  }, [onDeleteModalOpen, setWineryToEdit, setWineryToRemove]);

  return { renderCell, tableColumns };
};

export default useWineryTableRender