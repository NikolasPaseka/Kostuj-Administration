import { useTranslation } from 'react-i18next';
import { TranslationNS } from '../../translations/i18n';
import { DropdownActionItem } from '../../components/Dropdown/DropdownActionItems';
import { BookmarkSquareIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import AppRoutes from '../../utils/AppRoutes';
import { CatalogueType } from '../../model/Domain/CatalogueType';

const useActionItems = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const actionsItems: DropdownActionItem[] = [
    {
        key: "newFeastCatalogue",
        label: t("feastCatalogue", { ns: TranslationNS.catalogues }),
        description: t("feastCatalogueDesc", { ns: TranslationNS.catalogues }),
        startContent: <BookmarkSquareIcon className='w-5 h-5 text-secondary' />,
        onClick: () => {
          navigate(AppRoutes.FEAST_CATALOGUE_CREATE.replace(":type", CatalogueType.FEAST));
        }
    },
    {
        key: "newOpenCellarCatalogue",
        label: t("openCellarCatalogue", { ns: TranslationNS.catalogues }),
        description: t("openCellarCatalogueDesc", { ns: TranslationNS.catalogues }),
        startContent: <BookmarkSquareIcon className='w-5 h-5 text-secondary' />,
        onClick: () => {
          navigate(AppRoutes.FEAST_CATALOGUE_CREATE.replace(":type", CatalogueType.OPEN_CELLAR));
        }
    }
  ]

  return actionsItems;
}

export default useActionItems