import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AppRoutes from './utils/AppRoutes';
import Sidebar from './components/Sidebar/Sidebar'
import HomePage from './pages/homepage/HomePage'
import SignInPage from './pages/SignInPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthProvider';
import RegistrationPage from './pages/RegistrationPage';
import FeastCataloguesPage from './pages/feastCatalogues/FeastCataloguesPage';
import FeastCatalogueDetailPage from './pages/feastCatalogueDetail/FeastCatalogueDetailPage';
import FeastCatalogueCreatePage from './pages/feastCatalogueCreate/FeastCatalogueCreatePage';
import FeastCatalogueContentPage from './pages/feastCatalogueContent/FeastCatalogueContentPage';
import SettingsPage from './pages/SettingsPage';
import VoiceTest from './pages/VoiceTest';
import UsersManagementPage from './pages/usersManagement/UsersManagementPage';

const AppLayout = () => {
  const location = useLocation();
  const hideSidebarRoutes = [
    /^\/profile$/,
    /^\/signIn$/,
    /^\/register$/,
    /^\/feastCatalogues\/create$/,
    ///^\/feastCatalogues\/.*\/edit$/,
  ];

  const isSidebarVisible = !hideSidebarRoutes.some((pattern) => pattern.test(location.pathname));

  return (
    <div className="flex">
      <AuthProvider>
        {isSidebarVisible && <Sidebar />}
        <div className="flex-1 p-4 max-w-screen-2xl mx-auto">
          <Routes>
            <Route path={AppRoutes.HOME} element={<HomePage />} />
            <Route path={AppRoutes.PROFILE} element={
              <ProtectedRoute> 
                <HomePage /> 
              </ProtectedRoute>} 
            />
            <Route path={AppRoutes.FEAST_CATALOGUES} element={<FeastCataloguesPage />} />
            <Route path={AppRoutes.FEAST_CATALOGUE_DETAIL} element={<FeastCatalogueDetailPage />} />
            <Route path={AppRoutes.FEAST_CATALOGUE_CONTENT} element={<FeastCatalogueContentPage />} />
            <Route path={AppRoutes.FEAST_CATALOGUE_EDIT} element={<FeastCatalogueCreatePage />} />
            <Route path={AppRoutes.FEAST_CATALOGUE_CREATE} element={<FeastCatalogueCreatePage />} />
            <Route path={AppRoutes.USERS_MANAGEMENT} element={<UsersManagementPage />} />
            <Route path={AppRoutes.SETTINGS} element={<SettingsPage />} />
            <Route path={AppRoutes.SIGN_IN} element={<SignInPage />} />
            <Route path={AppRoutes.REGISTER} element={<RegistrationPage />} />
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
