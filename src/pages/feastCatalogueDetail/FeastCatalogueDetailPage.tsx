import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CommunicationResult, isSuccess } from '../../communication/CommunicationsResult';
import { Catalogue } from '../../model/Catalogue';
import { resolveUiState, UiState, UiStateType } from '../../communication/UiState';
import UiStateHandler from '../../components/UiStateHandler';
import { Card, CardBody, Switch, Divider, useDisclosure, Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem } from "@heroui/react";
import CardInfoRow from './components/CardInfoRow';
import { ArrowDownOnSquareIcon, ArrowDownTrayIcon, ArrowUpOnSquareIcon, CalendarDaysIcon, ChevronRightIcon, CurrencyDollarIcon, EllipsisVerticalIcon, MapPinIcon, PencilSquareIcon, SparklesIcon, TrashIcon, UserIcon, UsersIcon } from '@heroicons/react/24/solid';
import PrimaryButton from '../../components/PrimaryButton';
import { useTranslation } from 'react-i18next';
import { TranslationNS } from '../../translations/i18n';
import ImageSlider from '../../components/ImageSlider';
import { CatalogueRepository } from '../../communication/repositories/CatalogueRepository';
import ImportDataModal from './components/ImportDataModal';
import WineGlassIcon from '../../components/Icons/WineGlassIcon';
import StoreIcon from '../../components/Icons/StoreIcon';
import { convertUnixToDateString } from '../../utils/conversionUtils';
import { WineColor } from '../../model/Domain/WineColor';
import CatalogueOrganizators from './components/CatalogueOrganizators';
import useCatalogueOwnerCheck from '../../hooks/useCatalogueOwnerCheck';
import { VoiceControlRepository } from '../../communication/repositories/VoiceControlRepository';


const FeastCatalogueDetailPage = () => {
  //const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();

  const [uiState, setUiState] = useState<UiState>({ type: UiStateType.LOADING });

  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);

  const { isAdminOwner } = useCatalogueOwnerCheck({ catalogue });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const fetchCatalogue = async () => {
      const res = await CatalogueRepository.getCatalogueDetail(id ?? "");
      const catalogue = resolveUiState(res, setUiState);
      setCatalogue(catalogue);
    }
    
    fetchCatalogue();
    //TODO ping
    VoiceControlRepository.ping();
  }, [id]);

  const deleteCatalogue = async () => {
    // TODO: uncomment and make dialog before
    // if (catalogue == null) { return; }

    // const res = await CatalogueRepository.deleteCatalogue(catalogue);
    // if (isSuccess(res)) {
    //   navigate("/feastCatalogues");
    // }
  }

  const updatePublishState = async (state: boolean) => {
    if (catalogue === null) { return; }
    if (catalogue.published === state) { return; }

    const res: CommunicationResult<Catalogue> = await CatalogueRepository.updatePublishState(catalogue, state);
    if (isSuccess(res)) {
      setCatalogue({ ...catalogue, published: state });
    }
  }

  return (
    <div className="">
      { catalogue && <>
          <div className="flex flex-row items-center justify-end my-4">
            {isAdminOwner() &&
              <Switch isSelected={catalogue?.published} onValueChange={(state: boolean) => updatePublishState(state)} className="px-4">
                {t("publish", { ns: TranslationNS.catalogues })}
              </Switch>
            }

            <Link to={`/feastCatalogues/${catalogue.id}/edit`}>
              <PrimaryButton className="mx-2" EndContent={PencilSquareIcon}>
                {t("edit", { ns: TranslationNS.catalogues })}
              </PrimaryButton>
            </Link>


            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  size="md"
                  color="secondary"
                  variant="bordered"
                  className="min-w-4 px-2 rounded-md bg-lightContainer text-black border-lightContainer"
                >
                  <EllipsisVerticalIcon className="w-6 h-6" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                disabledKeys={isAdminOwner() ? [] : ["delete"]}
              >
                <DropdownItem
                  key={"import"}
                  startContent={<ArrowDownOnSquareIcon className="w-5 h-5 text-secondary" />}
                  description={"Import data from excel file"}
                  onClick={onOpen}
                >
                  {"Import"}
                </DropdownItem>
                <DropdownItem
                  key={"export"}
                  startContent={<ArrowUpOnSquareIcon className="w-5 h-5 text-secondary" />}
                  description={"Export data to excel file"}
                >
                  {"Export"}
                </DropdownItem>
                <DropdownItem
                  key={"delete"}
                  startContent={<TrashIcon className="w-5 h-5 text-secondary" />}
                  description={"Delete the catalogue and all its content"}
                  color='danger'
                  onClick={deleteCatalogue}
                >
                  {"Delete"}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            {/* <PrimaryButton onClick={deleteCatalogue} className="mx-2 bg-danger" EndContent={TrashIcon}>
              {t("delete", { ns: TranslationNS.catalogues })}
            </PrimaryButton> */}
          </div>

          <div className="flex gap-4"> 
            <Card className="flex-1 self-start">
              <CardBody>
                <div className="overflow-hidden">
                  <p className="text-xl font-bold py-4">{catalogue.title}</p>
                  <Divider />
                  <CardInfoRow headline={t("feastYear", { ns: TranslationNS.catalogues })} body={catalogue.year.toString()} Icon={SparklesIcon} />
                  <CardInfoRow headline={t("dateAndTime", { ns: TranslationNS.catalogues })} body={convertUnixToDateString(catalogue.startDate)} Icon={CalendarDaysIcon} />
                  <CardInfoRow headline={t("placeAndAddress", { ns: TranslationNS.catalogues })} body={catalogue.address} Icon={MapPinIcon} />
                  <CardInfoRow 
                    headline={t("organizer", { ns: TranslationNS.catalogues })} 
                    body={catalogue.fetchedAdmin ? `${catalogue.fetchedAdmin.firstName} ${catalogue.fetchedAdmin.lastName}` : catalogue.adminId as string} 
                    Icon={UserIcon} 
                  />
                  {catalogue.description &&
                    <CardInfoRow 
                      headline={null} 
                      body={catalogue.description}
                      Icon={PencilSquareIcon} 
                    />
                  }
                  <CardInfoRow headline={t("price", { ns: TranslationNS.catalogues })} body={catalogue.price.toString()} Icon={CurrencyDollarIcon} />
                  <CardInfoRow headline={t("downloads", { ns: TranslationNS.catalogues })} body={catalogue.downloads.toString()} Icon={ArrowDownTrayIcon} />
                </div>
              </CardBody>
            </Card>

          {catalogue.imageUrl && catalogue.imageUrl.length > 0 &&
                <div className="basis-[25%] h-[35rem]">
                  <ImageSlider imageUrls={catalogue.imageUrl} />
                </div>
              }
          </div>
          
          <div className="flex items-center py-4 mt-4 px-6">
            <h1 className="text-lg font-bold">Catalogue Content</h1>
          </div>
          
          <div className="flex gap-6 px-6">
            <Card className="flex-1 py-4">
              <CardBody>
                <div className="flex flex-row items-center h-full gap-4 px-4">
                  <StoreIcon color="secondary" size={38} />
                  <div className="flex-1">
                    <h4 className="text-base font-bold">Participated wineries</h4>
                    <p>Number of participated: {catalogue.participatedWineriesCount}</p>
                  </div>
                  <Link to={`/feastCatalogues/${catalogue.id}/content/winery`}>
                    <PrimaryButton 
                      size="sm" 
                      isSecondary
                      EndContent={ChevronRightIcon}
                    >
                      Show wineries
                    </PrimaryButton>
                  </Link>
                </div>
              </CardBody>
            </Card>

            <Card className="flex-1">
              <CardBody>
                <div className="flex flex-row items-center h-full gap-4 px-4">
                  <WineGlassIcon color="black" size={38} />
                  <div className="flex-1">
                    <h4 className="text-base font-bold">Wine Samples</h4>
                    <div className="flex flex-row gap-2">
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-redWineColor rounded-full mr-2"></span>
                        <span>{catalogue.samplesColorCounts?.[WineColor.RED] ?? 0}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-whiteWineColor rounded-full mr-2"></span>
                        <span>{catalogue.samplesColorCounts?.[WineColor.WHITE] ?? 0}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-roseWineColor rounded-full mr-2"></span>
                        <span>{catalogue.samplesColorCounts?.[WineColor.ROSE] ?? 0}</span>
                      </div>
                    </div>
                  </div>
                  <Link to={`/feastCatalogues/${catalogue.id}/content/wine`}>
                    <PrimaryButton 
                      size="sm" 
                      isSecondary
                      EndContent={ChevronRightIcon}
                    >
                      Show wine samples
                    </PrimaryButton>
                  </Link>
                </div>
              </CardBody>
            </Card>
          </div>
          
          <div className="flex gap-6 px-6 py-8">
            <Card className="flex-1 py-4 self-start">
              <CardBody>
                <div className="flex flex-row items-center h-full gap-4 px-4">
                  <UsersIcon className='w-10 h-10'/>
                  <div className="flex-1">
                    <h4 className="text-base font-bold">Rating commissions</h4>
                    {/* TODO */}
                    <p>Number of commissions: 5</p>
                  </div>
                  <Link to={`/feastCatalogues/${catalogue.id}/content/commission`}>
                    <PrimaryButton 
                      size="sm" 
                      isSecondary
                      EndContent={ChevronRightIcon}
                    >
                      Show commissions
                    </PrimaryButton>
                  </Link>
                </div>
              </CardBody>
            </Card>

            <CatalogueOrganizators 
              coOrganizers={catalogue.coorganizators} 
              catalogue={catalogue}
              onAdd={(user) => {
                setCatalogue({ ...catalogue, coorganizators: [...catalogue.coorganizators, user] })
              }}
              onRemove={(coorganizatorId) => {
                setCatalogue({ ...catalogue, coorganizators: catalogue.coorganizators.filter(coorganizator => coorganizator.id !== coorganizatorId) })
              }} 
              className="flex-1"
            />
          </div>

          <ImportDataModal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange} 
            catalogue={catalogue} 
            onImportedDataLoaded={() => {}}
          />
        
        </>
      }
      <UiStateHandler uiState={uiState} />
    </div>
  )
}

export default FeastCatalogueDetailPage