import { Card, CardBody, Chip, Image } from "@heroui/react"
import { Catalogue } from '../../../model/Catalogue'
import { ArrowDownTrayIcon, CheckCircleIcon, ChevronRightIcon, ClipboardDocumentListIcon, CurrencyDollarIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TranslationNS } from '../../../translations/i18n';
import useCatalogueOwnerCheck from '../../../hooks/useCatalogueOwnerCheck';
import { CatalogueType, getCatalogueTypeLabel } from '../../../model/Domain/CatalogueType';

type Props = { catalogue: Catalogue; navPath: string };

const FeastCatalogueListCard = ({ catalogue, navPath }: Props, key: React.Key) => {
  const { t } = useTranslation();

  const { isAdminOwner } = useCatalogueOwnerCheck({ catalogue });

  return (
    <Link to={navPath}>
    <Card 
      key={key} 
      className="py-4"
    >
      <CardBody className="p-2 px-4 flex-row">
        
        <div className="">
          {catalogue.imageUrl && catalogue.imageUrl.length > 0 && 
            <Image
              alt="Card background"
              isZoomed={true}
              src={catalogue.imageUrl[0]}
              style={{ width: '180px', height: '220px', objectFit: 'cover' }}
            />
          }
        </div>

        <div className="flex-1 flex-col px-6">
          <h4 className="font-bold text-large">{catalogue.title}</h4>
          <div className="flex flex-row gap-2 my-2">

            <Chip 
              variant="solid"
              className={`px-2 
                ${catalogue.type == CatalogueType.FEAST 
                  ? `bg-orange-200 text-orange-800` 
                  : `bg-blue-300 text-blue-900`}
              `}
              startContent={ <ClipboardDocumentListIcon className="h-5 w-5"/> }
            >
              {getCatalogueTypeLabel(catalogue.type)}
            </Chip>

            <Chip 
              color={catalogue.published ? "success" : "warning"}
              variant="flat"
              className="px-2"
              startContent={ <CheckCircleIcon className="h-5 w-5"/> }
            >
              {catalogue.published ? t("published", { ns: TranslationNS.catalogues }) : t("notPublished", { ns: TranslationNS.catalogues })}
            </Chip>

            <Chip 
              color={isAdminOwner() ? "success" : "primary"}
              variant="flat"
              className="px-2 text-primary"
              startContent={ <UserCircleIcon className="h-5 w-5"/> }
            >
              {isAdminOwner() ? "Owner" : "Co-Organizator"}
            </Chip>

            <Chip 
              color="secondary" 
              variant="solid"
              className="px-2"
              startContent={ <CurrencyDollarIcon className="h-5 w-5"/> }
            >
              {catalogue.price} Kč
            </Chip>
            <Chip 
              color="secondary" 
              variant="solid"
              className="px-2"
              startContent={ <ArrowDownTrayIcon className="h-5 w-5"/> }
            >
              {catalogue.downloads}
            </Chip>
          </div>
          <small className="text-default-500 break-all">{catalogue.description}</small>
        </div>

        <div className="m-auto">
          <ChevronRightIcon className="h-6 w-6" aria-hidden="true" />
        </div>
        
      </CardBody>
    </Card>
    </Link>
  )
}

export default FeastCatalogueListCard