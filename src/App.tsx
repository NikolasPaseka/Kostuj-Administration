import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
  const hideSidebarRoutes = ['/profile', '/signIn', '/register'];

  const isSidebarVisible = !hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex">
      <AuthProvider>
        {isSidebarVisible && <Sidebar />}
        <div className="flex-1 p-4 max-w-screen-2xl mx-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={
                <ProtectedRoute> 
                  <HomePage /> 
                </ProtectedRoute>} 
              />
              <Route path="/feastCatalogues" element={<FeastCataloguesPage />} />
              <Route path="/feastCatalogues/:id/detail" element={<FeastCatalogueDetailPage />} />
              <Route path="/feastCatalogues/:id/content" element={<FeastCatalogueContentPage />} />
              <Route path="/feastCatalogues/:id/edit" element={<FeastCatalogueCreatePage />} />
              <Route path="/feastCatalogues/create" element={<FeastCatalogueCreatePage />} />
              <Route path="/usersManagement" element={<UsersManagementPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/signIn" element={<SignInPage />} />
              <Route path="/register" element={<RegistrationPage />} />
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
