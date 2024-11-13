import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AppRoutes from './utils/AppRoutes';
import Sidebar from './components/Sidebar/Sidebar'
import HomePage from './pages/homepage/HomePage'
import SignInPage from './pages/SignInPage';
import { AuthProvider } from './context/AuthProvider';
import RegistrationPage from './pages/RegistrationPage';
import FeastCataloguesPage from './pages/feastCatalogues/FeastCataloguesPage';
import FeastCatalogueDetailPage from './pages/feastCatalogueDetail/FeastCatalogueDetailPage';
import FeastCatalogueCreatePage from './pages/feastCatalogueCreate/FeastCatalogueCreatePage';
import FeastCatalogueWineContentPage from './pages/feastCatalogueContent/FeastCatalogueWineContentPage';
import SettingsPage from './pages/SettingsPage';
import VoiceTest from './pages/VoiceTest';
import UsersManagementPage from './pages/usersManagement/UsersManagementPage';
import FeastCatalogueWineriesContentPage from './pages/feastCatalogueContent/FeastCatalogueWineriesContentPage';
import PrivateRoute from './components/PrivateRoute';
import NoAuthorizationPage from './pages/NoAuthorizationPage';
import WineriesManagementPage from './pages/wineriesManagement/WineriesManagementPage';
import ProfileSettingsPage from './pages/profileAndSettings/ProfileAndSettingsPage';

console.log(import.meta.env.VITE_BE_URL)

const AppLayout = () => {
  const location = useLocation();
  const hideSidebarRoutes = [
    /^\/signIn$/,
    /^\/register$/,
    /^\/noAuth$/,
  ];

  const smallerSidebarRoutes = [
    /^\/profile$/,
    /^\/feastCatalogues\/create$/,
    /^\/feastCatalogues\/.*\/edit$/,
    /^\/feastCatalogues\/.*\/content\/wine$/,
  ]

  const isSidebarVisible = !hideSidebarRoutes.some((pattern) => pattern.test(location.pathname));
  const isSidebarSmaller = smallerSidebarRoutes.some((pattern) => pattern.test(location.pathname));

  return (
    <div className="flex">
      <AuthProvider>
        {isSidebarVisible && <Sidebar showFull={!isSidebarSmaller} /> }
        <div className="flex-1 py-4 px-8 max-w-screen-2xl mx-auto">
          <Routes>
            <Route path="/" element={<PrivateRoute />}>
              <Route path={AppRoutes.HOME} element={<HomePage />} />
              <Route path={AppRoutes.PROFILE_AND_SETTINGS} element={<ProfileSettingsPage />} />
              <Route path={AppRoutes.FEAST_CATALOGUES} element={<FeastCataloguesPage />} />
              <Route path={AppRoutes.FEAST_CATALOGUE_DETAIL} element={<FeastCatalogueDetailPage />} />
              <Route path={AppRoutes.FEAST_CATALOGUE_CONTENT_WINE} element={<FeastCatalogueWineContentPage />} />
              <Route path={AppRoutes.FEAST_CATALOGUE_CONTENT_WINERY} element={<FeastCatalogueWineriesContentPage />} />
              <Route path={AppRoutes.FEAST_CATALOGUE_EDIT} element={<FeastCatalogueCreatePage />} />
              <Route path={AppRoutes.FEAST_CATALOGUE_CREATE} element={<FeastCatalogueCreatePage />} />
              <Route path={AppRoutes.WINERIES_MANAGEMENT} element={<WineriesManagementPage />} />
              <Route path={AppRoutes.USERS_MANAGEMENT} element={<UsersManagementPage />} />
              <Route path={AppRoutes.SETTINGS} element={<SettingsPage />} />
            </Route>
            <Route path={AppRoutes.SIGN_IN} element={<SignInPage />} />
            <Route path={AppRoutes.REGISTER} element={<RegistrationPage />} />
            <Route path={AppRoutes.NO_AUTH_PAGE} element={<NoAuthorizationPage />} />
            {/* TODO: Delete later */}
            <Route path="/voiceTest" element={<VoiceTest />} />
          </Routes>
        </div>
      </AuthProvider>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  )
}

export default App
