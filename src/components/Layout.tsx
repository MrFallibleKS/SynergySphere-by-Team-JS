
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import PageLoader from './PageLoader';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Show loader when route changes
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // Show loader for 1.2 seconds
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  if (!isAuthenticated) {
    return (
      <>
        {isLoading && <PageLoader />}
        {children}
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {isLoading && <PageLoader />}
      <Navbar />
      <div className="flex flex-1 relative">
        <Sidebar />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-auto transition-all duration-300 ease-in-out">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
