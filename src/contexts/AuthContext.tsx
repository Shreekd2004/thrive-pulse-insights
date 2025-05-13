
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export type UserRole = "hr" | "manager" | "employee";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  managerId?: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Dummy users for demonstration
const USERS: User[] = [
  {
    id: "1",
    email: "hr@example.com",
    name: "HR Admin",
    role: "hr",
    avatar: "https://i.pravatar.cc/150?u=hr@example.com",
    department: "Human Resources",
  },
  {
    id: "2",
    email: "manager@example.com",
    name: "Team Manager",
    role: "manager",
    avatar: "https://i.pravatar.cc/150?u=manager@example.com",
    department: "Engineering",
  },
  {
    id: "3",
    email: "employee@example.com",
    name: "John Employee",
    role: "employee",
    avatar: "https://i.pravatar.cc/150?u=employee@example.com",
    department: "Engineering",
    managerId: "2",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login function - in real app, this would call Supabase auth
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const foundUser = USERS.find((u) => u.email === email);
      if (foundUser && password === "password") {
        // In a real app, we would verify the password using Supabase Auth
        setUser(foundUser);
        localStorage.setItem("user", JSON.stringify(foundUser));
        
        // Navigate to appropriate dashboard based on role
        navigate(`/${foundUser.role}/dashboard`);
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
