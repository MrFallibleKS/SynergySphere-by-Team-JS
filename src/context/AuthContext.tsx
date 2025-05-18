
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
  }
];

// The key issue is here - we need to move the useNavigate hook inside the component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          setCurrentUser(userWithoutPassword);
          setIsAuthenticated(true);
          localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
          resolve();
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    // Instead of using navigate directly, we let the component that uses this function handle navigation
    // This is because navigate should be used inside a component, not here
    // The Index.tsx component should handle redirection after logout
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const existingUser = mockUsers.find((u) => u.email === email);

        if (existingUser) {
          reject(new Error('User already exists'));
          return;
        }

        // In a real app, we would save to a database
        const newUser = {
          id: `${mockUsers.length + 1}`,
          name,
          email,
          password,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        };

        mockUsers.push(newUser);

        const { password: _, ...userWithoutPassword } = newUser;
        setCurrentUser(userWithoutPassword);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        resolve();
      }, 1000);
    });
  };

  const value = {
    currentUser,
    isAuthenticated,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
