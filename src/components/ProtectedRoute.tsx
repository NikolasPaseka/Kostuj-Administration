import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { ReactNode } from 'react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();

  const { accessToken } = auth;

  if (!accessToken) {
    return <Navigate to="/signIn" />;
  }

  return children;
};

export default ProtectedRoute;