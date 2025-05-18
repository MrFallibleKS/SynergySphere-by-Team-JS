
import React, { useState } from 'react';
import { Bell, Menu, User, LogOut, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useTheme } from '@/hooks/use-theme';
import Sidebar from './Sidebar';
import MobileNotifications from './MobileNotifications';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { notifications, markNotificationAsRead } = useData();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get unread notifications for the current user
  const unreadNotifications = notifications.filter(
    n => n.userId === currentUser?.id && !n.read
  );

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {isMobile ? (
              <Drawer open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[80%]">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8">
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16" cy="16" r="16" fill="url(#gradient)" />
                            <path d="M22 12L16 7L10 12L10 22L22 22L22 12Z" fill="white" fillOpacity="0.5" />
                            <path d="M16 7L10 12L16 17L22 12L16 7Z" fill="white" />
                            <defs>
                              <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#4776E6" />
                                <stop offset="1" stopColor="#8E54E9" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 bg-clip-text text-transparent">
                          SynergySphere
                        </h1>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="py-2 px-2">
                      <div className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md mb-4">
                        <LayoutGrid className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                        <span className="font-medium">Projects</span>
                      </div>
                      {/* Mobile navigation items will go here */}
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            ) : null}
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 mr-2">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="url(#gradient)" />
                  <path d="M22 12L16 7L10 12L10 22L22 22L22 12Z" fill="white" fillOpacity="0.5" />
                  <path d="M16 7L10 12L16 17L22 12L16 7Z" fill="white" />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#4776E6" />
                      <stop offset="1" stopColor="#8E54E9" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 bg-clip-text text-transparent">SynergySphere</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notifications */}
            {isMobile ? (
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadNotifications.length > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                        {unreadNotifications.length}
                      </span>
                    )}
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[60%]">
                  <div className="p-4">
                    <MobileNotifications />
                  </div>
                </DrawerContent>
              </Drawer>
            ) : (
              <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadNotifications.length > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                        {unreadNotifications.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    Notifications
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-64 overflow-y-auto">
                    {unreadNotifications.length > 0 ? (
                      unreadNotifications.map(notification => (
                        <DropdownMenuItem key={notification.id} className="cursor-pointer" onSelect={() => markNotificationAsRead(notification.id)}>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {notification.type === 'TASK_ASSIGNED' && 'New Task Assigned'}
                              {notification.type === 'COMMENT_ADDED' && 'New Comment'}
                              {notification.type === 'TASK_DUE_SOON' && 'Task Due Soon'}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(notification.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No new notifications
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                    <AvatarFallback>{currentUser?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to="/profile">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={toggleTheme}>
                  {theme === 'dark' ? (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      Dark Mode
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
