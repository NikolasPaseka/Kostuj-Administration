import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CommunicationResult, isSuccess } from '../../communication/CommunicationsResult';
import { Catalogue } from '../../model/Catalogue';
import { useAuth } from '../../context/AuthProvider';
import { axiosCall } from '../../communication/axios';
import { UiState, UiStateType } from '../../communication/UiState';
import UiStateHandler from '../../components/UiStateHandler';
import { Button, Card, CardBody, Switch, Image, Divider } from '@nextui-org/react';
import CardInfoRow from './components/CardInfoRow';
import { ArrowDownTrayIcon, CalendarDaysIcon, CurrencyDollarIcon, MapPinIcon, PencilSquareIcon, SparklesIcon, TrashIcon, UserIcon } from '@heroicons/react/24/solid';
import PrimaryButton from '../../components/PrimaryButton';
import { Winery } from '../../model/Winery';
import WineryTable from '../../components/Tables/WineryTable';

const FeastCatalogueDetailPage = () => {
  const [uiState, setUiState] = useState<UiState>({ type: UiStateType.LOADING });
  const [wineriesUiState, setWineriesUiState] = useState<UiState>({ type: UiStateType.LOADING });


  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [participatedWineries, setParticipatedWineries] = useState<Winery[]>([]);

  const { id } = useParams();
  const { accessToken } = useAuth();
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
              Publish
            </Switch>
            <Link to={`/feastCatalogues/${catalogue.id}/edit`}>
              <PrimaryButton className="mx-2" EndContent={PencilSquareIcon}>Edit</PrimaryButton>
            </Link>
            <PrimaryButton onClick={deleteCatalogue} className="mx-2" EndContent={TrashIcon}>Delete</PrimaryButton>
          </div>

          <Card>
            <CardBody className="flex flex-row">
              <div className="flex-1">
                <p className="text-xl font-bold py-4">{catalogue.title}</p>
                <Divider />
                <CardInfoRow headline="Feast Year" body={catalogue.year.toString()} Icon={SparklesIcon} />
                <CardInfoRow headline="Date and Time" body={catalogue.startDate.toString()} Icon={CalendarDaysIcon} />
                <CardInfoRow headline="Place and Address" body={catalogue.address} Icon={MapPinIcon} />
                <CardInfoRow headline="Organizator" body={catalogue.adminId} Icon={UserIcon} />
                {catalogue.description &&
                  <CardInfoRow headline={null} body={catalogue.description} Icon={PencilSquareIcon} />
                }
                <CardInfoRow headline="Price" body={catalogue.price.toString()} Icon={CurrencyDollarIcon} />
                <CardInfoRow headline="Downloads" body={catalogue.downloads.toString()} Icon={ArrowDownTrayIcon} />
              </div>
              {catalogue.imageUrl && catalogue.imageUrl.length > 0 &&
                <div style={{ flexBasis: '30%'}}>
                <Image
                  isZoomed={true}
                  src={catalogue.imageUrl[0]}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                </div>
              }
            </CardBody>
          </Card>
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