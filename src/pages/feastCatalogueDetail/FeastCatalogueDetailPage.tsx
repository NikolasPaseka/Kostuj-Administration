import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CommunicationResult, isSuccess } from '../../communication/CommunicationsResult';
import { Catalogue } from '../../model/Catalogue';
import { useAuth } from '../../context/AuthProvider';
import { axiosCall } from '../../communication/axios';
import { UiState, UiStateType } from '../../communication/UiState';
import UiStateHandler from '../../components/UiStateHandler';
import { Button, Card, CardBody, Switch, Divider } from '@nextui-org/react';
import CardInfoRow from './components/CardInfoRow';
import { ArrowDownTrayIcon, CalendarDaysIcon, CurrencyDollarIcon, MapPinIcon, PencilSquareIcon, SparklesIcon, TrashIcon, UserIcon } from '@heroicons/react/24/solid';
import PrimaryButton from '../../components/PrimaryButton';
import { Winery } from '../../model/Winery';
import WineryTable from '../../components/Tables/WineryTable';
import { useTranslation } from 'react-i18next';
import { TranslationNS } from '../../translations/i18n';
import ImageSlider from '../../components/ImageSlider';

const FeastCatalogueDetailPage = () => {
  const [uiState, setUiState] = useState<UiState>({ type: UiStateType.LOADING });
  const [wineriesUiState, setWineriesUiState] = useState<UiState>({ type: UiStateType.LOADING });

  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [participatedWineries, setParticipatedWineries] = useState<Winery[]>([]);

  const { id } = useParams();
  const { accessToken } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCatalogue = async () => {
      const res: CommunicationResult<Catalogue> = await axiosCall(`/catalogues/${id}`, "GET", undefined, accessToken ?? undefined);
      if (isSuccess(res)) {
        setUiState({ type: UiStateType.SUCCESS })
        setCatalogue(res.data);
        fetchParticipatedWineries(res.data);
      } else {
        setUiState({ 
          type: UiStateType.ERROR,
          message: res.message
        })
      }
    }
    
    fetchCatalogue();
  }, [id, accessToken]);

  const fetchParticipatedWineries = async (catalogue: Catalogue) => {
    const res: CommunicationResult<Winery[]> = await axiosCall(`/catalogues/${catalogue.id}/wineries`, "GET", undefined, accessToken ?? undefined);
    if (isSuccess(res)) {
      setParticipatedWineries(res.data);
      setWineriesUiState({ type: UiStateType.SUCCESS });
    } else {
      setWineriesUiState({ 
        type: UiStateType.ERROR,
        message: res.message
      })
    }
  }

  const deleteCatalogue = async () => {
    if (catalogue == null) { return; }

    const res: CommunicationResult<Catalogue> = await axiosCall(`/catalogues/${catalogue?.id}`, "DELETE", undefined, accessToken ?? undefined);
    if (isSuccess(res)) {
      navigate("/feastCatalogues");
    }
  }

  const updatePublishState = async (state: boolean) => {
    if (catalogue === null) { return; }
    if (catalogue.published === state) { return; }

    const res: CommunicationResult<Catalogue> = await axiosCall(`/catalogues/${catalogue?.id}/publish`, "POST", { publish: state }, accessToken ?? undefined);
    if (isSuccess(res)) {
      setCatalogue({ ...catalogue, published: state });
    }
  }

  return (
    <div>
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
            <PrimaryButton onClick={deleteCatalogue} className="mx-2" EndContent={TrashIcon}>
              {t("delete", { ns: TranslationNS.catalogues })}
            </PrimaryButton>
          </div>

          <div className="flex gap-4 h-max"> 
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
          
          <Link to={`/feastCatalogues/${catalogue.id}/content`}>
            <Button color="primary" className="mt-4">Show Content</Button>
          </Link>
          <WineryTable wineries={participatedWineries} uiState={wineriesUiState} />
        </>
      }
      <UiStateHandler uiState={uiState} />
    </div>
  )
}

export default FeastCatalogueDetailPage