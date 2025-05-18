
import React, { useEffect } from 'react';
import AuthPage from './AuthPage';
import Dashboard from '@/components/Dashboard';
import LandingPage from './LandingPage';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Listen for authentication changes and redirect accordingly
  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/landing') {
      navigate('/landing', { replace: true });
    }
  }, [isAuthenticated, navigate, location.pathname]);
  
  if (!isAuthenticated) {
    return <LandingPage />;
  }
  
  return <Dashboard />;
};

export default Index;
