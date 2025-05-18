
import React from 'react';
import AuthPage from './AuthPage';
import Dashboard from '@/components/Dashboard';
import LandingPage from './LandingPage';
import { useAuth } from '@/context/AuthContext';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <LandingPage />;
  }
  
  return <Dashboard />;
};

export default Index;
