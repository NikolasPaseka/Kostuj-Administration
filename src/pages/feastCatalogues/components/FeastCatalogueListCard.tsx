import { Card, CardBody, Chip, Image } from '@nextui-org/react'
import { Catalogue } from '../../../model/Catalogue'
import { ArrowDownTrayIcon, CheckCircleIcon, ChevronRightIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TranslationNS } from '../../../translations/i18n';

type Props = { catalogue: Catalogue; navPath: string };

const FeastCatalogueListCard = ({ catalogue, navPath }: Props, key: React.Key) => {
  const { t } = useTranslation();

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
              // className="object-cover w-full h-full"
            />
            // <img 
            //   src={catalogue.imageUrl[0]}
            //   style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            // ></img>
          }
        </div>

        <div className="flex-1 flex-col px-6">
          <h4 className="font-bold text-large">{catalogue.title}</h4>
          <div className="flex flex-row gap-2 my-2">
            {catalogue.published ?
              <Chip 
                color="success" 
                variant="flat"
                className="px-2"
                startContent={ <CheckCircleIcon className="h-5 w-5"/> }
              >
                {t("published", { ns: TranslationNS.catalogues })}
              </Chip>
              :
              <Chip 
                color="warning" 
                variant="flat"
                className="px-2"
                startContent={ <CheckCircleIcon className="h-5 w-5"/> }
              >
                {t("notPublished", { ns: TranslationNS.catalogues })}
              </Chip>
            }

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