import { useAuth } from '../context/AuthProvider';
import { Catalogue } from '../model/Catalogue';

type Props = {
    catalogue: Catalogue | null;
}

const useCatalogueOwnerCheck = ({ catalogue }: Props) => {
  const { getUserData } = useAuth();
  const userId = getUserData()?.id;

  const isAdminOwner = () => {
    if (catalogue === null || userId === undefined) return false;
    return catalogue.adminId === userId;
  };

  return { isAdminOwner };
};

export default useCatalogueOwnerCheck;