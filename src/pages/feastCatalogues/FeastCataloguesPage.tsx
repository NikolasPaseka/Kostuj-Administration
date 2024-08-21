import { useEffect, useState } from 'react'
import { UiState, UiStateType } from '../../communication/UiState';
import { Catalogue } from '../../model/Catalogue';
import { CommunicationResult, isSuccess } from '../../communication/CommunicationsResult';
import { axiosCall } from '../../communication/axios';
import { useAuth } from '../../context/AuthProvider';
import UiStateHandler from '../../components/UiStateHandler';
import SearchInput from '../../components/SearchInput';
import { convertDateToTimestamp } from '../../utils/conversionUtils';
import FeastCatalogueListCard from './components/FeastCatalogueListCard';
import { Link } from 'react-router-dom';
import PrimaryButton from '../../components/PrimaryButton';
import { PlusIcon } from '@heroicons/react/24/solid';

const FeastCataloguesPage = () => {
  const [uiState, setUiState] = useState<UiState>({ type: UiStateType.LOADING });
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const currentDate = convertDateToTimestamp(new Date());

  const upcomingCatalogues = catalogues.filter((catalogue: Catalogue) => 
    catalogue.startDate > currentDate
  );
  const pastCatalogues = catalogues.filter((catalogue: Catalogue) => 
    catalogue.startDate <= currentDate
  );

  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchUserCatalogues = async () => {
      const res: CommunicationResult<Catalogue[]> = await axiosCall("/catalogues/byAdmin", "GET", undefined, accessToken ?? undefined);

      if (isSuccess(res)) {
        setUiState({ type: UiStateType.SUCCESS })
        setCatalogues(res.data);
      } else {
        setUiState({ 
          type: UiStateType.ERROR,
          message: res.message
        })
      }
    }

    fetchUserCatalogues();
  }, [accessToken]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center mt-8 mb-4 justify-end">
        <SearchInput onValueChange={setSearchValue} value={searchValue} />
        <Link to={"/feastCatalogues/create"}>
          <PrimaryButton EndContent={PlusIcon}>New catalogue</PrimaryButton>
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        <UiStateHandler uiState={uiState} />
        <h2 className="text-2xl font-bold">Upcoming Catalogues</h2>
        {upcomingCatalogues
          .filter((catalogue: Catalogue) => catalogue.title.toLowerCase().includes(searchValue.toLowerCase()))
          .map((catalogue: Catalogue) => (
            <FeastCatalogueListCard 
              key={catalogue.id} 
              catalogue={catalogue} 
              navPath={`/feastCatalogues/${catalogue.id}/detail`}
              />
          ))
        }

        <h2 className="text-2xl font-bold">Past Catalogues</h2>
        {pastCatalogues
          .filter((catalogue: Catalogue) => catalogue.title.toLowerCase().includes(searchValue.toLowerCase()))
          .map((catalogue: Catalogue) => (
            <FeastCatalogueListCard 
              key={catalogue.id} 
              catalogue={catalogue} 
              navPath={`/feastCatalogues/${catalogue.id}/detail`}
            />
          ))
        }
      </div>
    </div>
  )
}

export default FeastCataloguesPage