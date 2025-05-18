
import React from 'react';
import AuthPage from './AuthPage';
import Dashboard from '@/components/Dashboard';
import { useAuth } from '@/context/AuthContext';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? <Dashboard /> : <AuthPage />;
};

export default Index;
