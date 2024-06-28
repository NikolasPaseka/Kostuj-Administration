import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar'
import HomePage from './pages/homepage/HomePage'

const AppLayout = () => {
  const location = useLocation();
  const hideSidebarRoutes = ['/profile', '/settings'];

  const isSidebarVisible = !hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex">
      {isSidebarVisible && <Sidebar />}
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<HomePage />}>
            <Route path="dashboard" element={<HomePage />} />
          </Route>
          <Route path="/profile" element={<HomePage />} />
          <Route path="/settings" element={<HomePage />} />
        </Routes>
      </div>
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
