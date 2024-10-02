import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CommunicationResult, isSuccess } from '../../communication/CommunicationsResult';
import { Catalogue } from '../../model/Catalogue';
import { resolveUiState, UiState, UiStateType } from '../../communication/UiState';
import UiStateHandler from '../../components/UiStateHandler';
import { Card, CardBody, Switch, Divider, useDisclosure } from '@nextui-org/react';
import CardInfoRow from './components/CardInfoRow';
import { ArrowDownTrayIcon, CalendarDaysIcon, ChevronRightIcon, CurrencyDollarIcon, MapPinIcon, PencilSquareIcon, SparklesIcon, TrashIcon, UserIcon } from '@heroicons/react/24/solid';
import PrimaryButton from '../../components/PrimaryButton';
import { Winery } from '../../model/Winery';
import WineryTable from '../../components/Tables/WineryTable';
import { useTranslation } from 'react-i18next';
import { TranslationNS } from '../../translations/i18n';
import ImageSlider from '../../components/ImageSlider';
import { CatalogueRepository } from '../../communication/repositories/CatalogueRepository';
import ImportDataModal from './components/ImportDataModal';
import WineGlassIcon from '../../components/Icons/WineGlassIcon';
import StoreIcon from '../../components/Icons/StoreIcon';


const FeastCatalogueDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();

  const [uiState, setUiState] = useState<UiState>({ type: UiStateType.LOADING });
  const [wineriesUiState, setWineriesUiState] = useState<UiState>({ type: UiStateType.LOADING });

  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [participatedWineries, setParticipatedWineries] = useState<Winery[]>([]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const fetchCatalogue = async () => {
      const res = await CatalogueRepository.getCatalogueDetail(id ?? "");
      const catalogue = resolveUiState(res, setUiState);
      setCatalogue(catalogue);
      fetchParticipatedWineries(catalogue);
    }
    
    fetchCatalogue();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchParticipatedWineries = async (catalogue: Catalogue | null) => {
    if (catalogue == null) { return; }

    const wineriesRes = await CatalogueRepository.getParticipatedWineries(catalogue);
    setParticipatedWineries(resolveUiState(wineriesRes, setWineriesUiState) ?? []);
  }

  const deleteCatalogue = async () => {
    if (catalogue == null) { return; }

    const res = await CatalogueRepository.deleteCatalogue(catalogue);
    if (isSuccess(res)) {
      navigate("/feastCatalogues");
    }
  }

  const updatePublishState = async (state: boolean) => {
    if (catalogue === null) { return; }
    if (catalogue.published === state) { return; }

    const res: CommunicationResult<Catalogue> = await CatalogueRepository.updatePublishState(catalogue, state);
    if (isSuccess(res)) {
      setCatalogue({ ...catalogue, published: state });
    }
  }

  const removeWineryFromParticipated = async (winery: Winery) => {
    if (catalogue == null) { return; }

    const res = await CatalogueRepository.removeWineryFromParticipated(catalogue, winery);
    if (isSuccess(res)) {
      setParticipatedWineries([ ...participatedWineries.filter(w => w.id !== winery.id)]);
    }
  }

  return (
    <div className="">
      { catalogue && <>
          <div className="flex flex-row items-center justify-end my-4">
            <Switch isSelected={catalogue?.published} onValueChange={(state: boolean) => updatePublishState(state)}>
              {t("publish", { ns: TranslationNS.catalogues })}
            </Switch>
            <Link to={`/feastCatalogues/${catalogue.id}/edit`}>
              <PrimaryButton className="mx-2" EndContent={PencilSquareIcon}>
                {t("edit", { ns: TranslationNS.catalogues })}
              </PrimaryButton>
            </Link>
            <PrimaryButton onClick={deleteCatalogue} className="mx-2 bg-danger" EndContent={TrashIcon}>
              {t("delete", { ns: TranslationNS.catalogues })}
            </PrimaryButton>
          </div>

          <div className="flex gap-4"> 
            <Card className="flex-1 self-start">
              <CardBody>
                <div className="overflow-hidden">
                  <p className="text-xl font-bold py-4">{catalogue.title}</p>
                  <Divider />
                  <CardInfoRow headline={t("feastYear", { ns: TranslationNS.catalogues })} body={catalogue.year.toString()} Icon={SparklesIcon} />
                  <CardInfoRow headline={t("dateAndTime", { ns: TranslationNS.catalogues })} body={catalogue.startDate.toString()} Icon={CalendarDaysIcon} />
                  <CardInfoRow headline={t("placeAndAddress", { ns: TranslationNS.catalogues })} body={catalogue.address} Icon={MapPinIcon} />
                  <CardInfoRow headline={t("organizer", { ns: TranslationNS.catalogues })} body={catalogue.adminId} Icon={UserIcon} />
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
            <PrimaryButton onClick={onOpen} className="mx-8">Import data</PrimaryButton>
          </div>
          
          <div className="flex gap-6 px-6">
            <Card className="flex-1 py-4">
              <CardBody>
                <div className="flex flex-row items-center h-full gap-4 px-4">
                  <StoreIcon color="black" size={38} />
                  <div className="flex-1">
                    <h4 className="text-base font-bold">Participated wineries</h4>
                    <p>Number of participated: {participatedWineries.length}</p>
                  </div>
                  <Link to={`/feastCatalogues/${catalogue.id}/content`}>
                    <PrimaryButton 
                      size="sm" 
                      isSecondary
                      EndContent={ChevronRightIcon}
                    >
                      Show Content
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
                        <span>23</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-whiteWineColor rounded-full mr-2"></span>
                        <span>35</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-roseWineColor rounded-full mr-2"></span>
                        <span>32</span>
                      </div>
                    </div>
                  </div>
                  <Link to={`/feastCatalogues/${catalogue.id}/content`}>
                    <PrimaryButton 
                      size="sm" 
                      isSecondary
                      EndContent={ChevronRightIcon}
                    >
                      Show Content
                    </PrimaryButton>
                  </Link>
                </div>
              </CardBody>
            </Card>
          </div>

          <ImportDataModal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange} 
            catalogue={catalogue} 
            onImportedDataLoaded={() => fetchParticipatedWineries(catalogue)}
          />
          
          <WineryTable 
            wineries={participatedWineries}
            uiState={wineriesUiState}
            removeWineryFromParticipated={removeWineryFromParticipated}
          />
        </>
      }
      <UiStateHandler uiState={uiState} />
    </div>
  )
}

export default FeastCatalogueDetailPage