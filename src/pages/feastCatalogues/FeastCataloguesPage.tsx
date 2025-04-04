import { useEffect, useState } from 'react'
import { resolveUiState, UiState, UiStateType } from '../../communication/UiState';
import { Catalogue } from '../../model/Catalogue';
import UiStateHandler from '../../components/UiStateHandler';
import SearchInput from '../../components/SearchInput';
import { convertDateToTimestamp } from '../../utils/conversionUtils';
import FeastCatalogueListCard from './components/FeastCatalogueListCard';
import { BookmarkSquareIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { TranslationNS } from '../../translations/i18n';
import { CatalogueRepository } from '../../communication/repositories/CatalogueRepository';
import { InfoLanding } from '../../components/InfoLanding';
import DropdownMenuCustom from '../../components/Dropdown/DropdownMenuCustom';
import useActionItems from './useActionItems';

const FeastCataloguesPage = () => {
  const { t } = useTranslation();
  const [uiState, setUiState] = useState<UiState>({ type: UiStateType.LOADING });
  const actionItems = useActionItems();
  
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const currentDate = convertDateToTimestamp(new Date());

  const upcomingCatalogues = catalogues.filter((catalogue: Catalogue) => 
    catalogue.startDate > currentDate
  );
  const pastCatalogues = catalogues.filter((catalogue: Catalogue) => 
    catalogue.startDate <= currentDate
  );

  useEffect(() => {
    const fetchUserCatalogues = async () => {
      const res = await CatalogueRepository.getCataloguesByAdmin();
      setCatalogues(resolveUiState(res, setUiState) ?? []);
    }

    fetchUserCatalogues();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex items-center mt-8 mb-4 justify-end gap-4">
        <SearchInput onValueChange={setSearchValue} value={searchValue} />
        <DropdownMenuCustom 
          dropdownButtonText={t("newCatalogue", { ns: TranslationNS.catalogues })}
          actionItems={actionItems}
        />
      </div>

      <div className="flex flex-col gap-4">
        <UiStateHandler uiState={uiState} />
        <h2 className="text-2xl font-bold">{t("upcomingCatalogues", { ns: TranslationNS.catalogues })}</h2>
        {upcomingCatalogues.length === 0 && (
          <InfoLanding
            icon={<BookmarkSquareIcon />}
            title={"No upcoming catalogues"}
            theme={"info"}
            useSmaller={true}
          />
        )}
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

        <h2 className="text-2xl font-bold">{t("pastCatalogues", { ns: TranslationNS.catalogues })}</h2>
        {pastCatalogues.length === 0 && (
          <InfoLanding
            icon={<BookmarkSquareIcon />}
            title={"No past catalogues"}
            theme={"info"}
            useSmaller={true}
          />
        )}
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