import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { AuthorizationRoleValidator } from '../utils/AuthorizationRoleValidator';
import AppRoutes from '../utils/AppRoutes';

const PrivateRoute = () => {
  const { accessToken, getUserData } = useAuth();
  const userAuth = getUserData();
  const authValidator = AuthorizationRoleValidator.getInstance();

  return accessToken
    ? (userAuth && authValidator.hasAccessToAdministrationApp(userAuth.authorizations))
      ? <Outlet />
      : <Navigate to={AppRoutes.NO_AUTH_PAGE} />
    :<Navigate to="/signIn" />;
};

export default PrivateRoute;