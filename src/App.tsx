import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar'
import HomePage from './pages/homepage/HomePage'
import SignInPage from './pages/SignInPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthProvider';

const AppLayout = () => {
  const location = useLocation();
  const hideSidebarRoutes = ['/profile', '/settings', '/signIn'];

  const isSidebarVisible = !hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex">
      <AuthProvider>
        {isSidebarVisible && <Sidebar />}
        <div className="flex-1 p-4">
        
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={
                <ProtectedRoute> 
                  <HomePage /> 
                </ProtectedRoute>} 
              />
              <Route path="/settings" element={<HomePage />} />
              <Route path="/signIn" element={<SignInPage />} />
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
