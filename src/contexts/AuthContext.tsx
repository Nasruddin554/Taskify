
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const initialUser: User = {
  id: "1",
  email: "johndoe@example.com",
  name: "John Doe",
  role: "admin",
  avatar: "https://i.pravatar.cc/150?u=johndoe@example.com"
};

// Mock users for demo purposes
const mockUsers = [
  initialUser,
  {
    id: "2",
    email: "janedoe@example.com",
    name: "Jane Doe",
    role: "manager" as UserRole,
    avatar: "https://i.pravatar.cc/150?u=janedoe@example.com"
  },
  {
    id: "3",
    email: "mikebrown@example.com",
    name: "Mike Brown",
    role: "user" as UserRole,
    avatar: "https://i.pravatar.cc/150?u=mikebrown@example.com"
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('taskify-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching email (mock authentication)
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (foundUser && password === "password") {
        setUser(foundUser);
        localStorage.setItem('taskify-user', JSON.stringify(foundUser));
        toast({
          title: "Login successful",
          description: `Welcome back, ${foundUser.name}!`,
        });
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (mockUsers.some(u => u.email === email)) {
        throw new Error("Email already in use");
      }
      
      // Create new user (in a real app, this would be done on the backend)
      const newUser: User = {
        id: `${mockUsers.length + 1}`,
        email,
        name,
        role: "user",
        avatar: `https://i.pravatar.cc/150?u=${email}`
      };
      
      // Store user
      setUser(newUser);
      localStorage.setItem('taskify-user', JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: `Welcome to Taskify, ${name}!`,
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskify-user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully."
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
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
