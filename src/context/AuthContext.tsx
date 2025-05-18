
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users for demo purposes
const sampleUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6d28d9&color=fff',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=6d28d9&color=fff',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson&background=6d28d9&color=fff',
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for saved user in local storage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = sampleUsers.find(u => u.email === email);
      if (user && password === 'password') { // Demo password check
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        toast.success(`Welcome back, ${user.name}!`);
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('Login failed');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = sampleUsers.find(u => u.email === email);
      if (existingUser) {
        toast.error('User already exists with this email');
        return;
      }

      // Create new user (in a real app, this would be an API call)
      const newUser: User = {
        id: `${sampleUsers.length + 1}`,
        name,
        email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6d28d9&color=fff`,
      };
      
      // Add user to our sample users (in a real app, this would be a database operation)
      sampleUsers.push(newUser);
      
      // Set current user and save to local storage
      setCurrentUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      toast.success('Registration successful!');
    } catch (error) {
      toast.error('Registration failed');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast.info('You have been logged out.');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        isAuthenticated: !!currentUser,
        isLoading,
        login, 
        register,
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
