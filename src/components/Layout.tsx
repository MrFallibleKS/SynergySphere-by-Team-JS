
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {!isMobile && <Sidebar />}
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
