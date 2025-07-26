import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, register as apiRegister } from '../api/auth';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [error, setError] = useState(null);

  const register = async (userData) => {
    try {
      const response = await apiRegister(userData);
      const authData = response.data;

      localStorage.setItem('accessToken', authData.accessToken);
      localStorage.setItem('user', JSON.stringify(authData.user));
      setUser(authData.user);

      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
      return false;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      const { accessToken, user } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
      return false;
    }
  };

  const signout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, error, login, signout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
