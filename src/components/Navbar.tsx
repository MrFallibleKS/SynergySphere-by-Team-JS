
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  User,
} from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate('/landing');
  };
  
  // Show a simplified navbar for non-authenticated users on pages like landing
  if (!isAuthenticated) {
    return (
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/lovable-uploads/13d60c81-dde3-4f3d-a4ee-6c5bc6231383.png" alt="SynergySphere Logo" className="h-8 w-auto mr-2" />
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 bg-clip-text text-transparent hidden sm:inline">
                SynergySphere
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              className="rounded-full"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            {isMobile ? (
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                  <div className="flex flex-col h-full">
                    <div className="flex-1 py-4">
                      <ul className="space-y-2">
                        <li>
                          <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link to="/login">Login</Link>
                          </Button>
                        </li>
                        <li>
                          <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link to="/register">Register</Link>
                          </Button>
                        </li>
                      </ul>
                    </div>
                    <Button variant="default" className="w-full" asChild>
                      <Link to="/register">Get Started</Link>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }
  
  // Show full navbar for authenticated users
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col h-full">
                  <Link to="/" className="flex items-center py-4">
                    <img src="/lovable-uploads/13d60c81-dde3-4f3d-a4ee-6c5bc6231383.png" alt="SynergySphere Logo" className="h-8 w-auto mr-2" />
                    <span className="font-bold text-xl bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 bg-clip-text text-transparent">
                      SynergySphere
                    </span>
                  </Link>
                  <div className="flex-1 py-4">
                    <ul className="space-y-2">
                      <li>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                          <Link to="/">Dashboard</Link>
                        </Button>
                      </li>
                      <li>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                          <Link to="/tasks">Tasks</Link>
                        </Button>
                      </li>
                      <li>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                          <Link to="/profile">Profile</Link>
                        </Button>
                      </li>
                    </ul>
                  </div>
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/13d60c81-dde3-4f3d-a4ee-6c5bc6231383.png" alt="SynergySphere Logo" className="h-8 w-auto mr-2" />
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 bg-clip-text text-transparent hidden md:inline">
              SynergySphere
            </span>
          </Link>
          
          <nav className="hidden md:flex ml-6 space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/tasks">Tasks</Link>
            </Button>
          </nav>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            className="rounded-full"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5">3</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px]">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-auto">
                {Array.from({ length: 3 }).map((_, i) => (
                  <DropdownMenuItem key={i} className="cursor-pointer p-3">
                    <div>
                      <div className="font-medium text-sm">
                        {i === 0 ? 'New task assigned to you' : i === 1 ? 'Project updated' : 'Comment on your task'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Just now</div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 p-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback>{currentUser?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="hidden md:flex items-center">
                  <span className="mr-2">{currentUser?.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
