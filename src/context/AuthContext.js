import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, register as apiRegister } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage if present
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const register = async (userData) => {
    try {
      const data = await apiRegister(userData);
      // Optionally handle data if backend returns token + user on register
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
      return false;
    }
  };

  const login = async (credentials) => {
    try {
      const data = await apiLogin(credentials);
      // Assuming data has accessToken and user info
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify({
        userId: data.userId,
        email: data.email,
        name: data.name
      }));
      setUser({
        userId: data.userId,
        email: data.email,
        name: data.name
      });
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
      return false;
    }
  };

  const signout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, error, register, login, signout }}>
      {children}
    </AuthContext.Provider>
  );
};
