import { createContext, useContext, useState, useEffect } from 'react';
import { 
  login as loginService, 
  logout as logoutService, 
  register as registerService, 
  isAuthenticated, 
  getStoredUser 
} from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getStoredUser());
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    const response = await registerService(userData);
    return response;
  };

  const login = async (credentials) => {
    const response = await loginService(credentials);
    setUser(response.data.user);
    return response;
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};