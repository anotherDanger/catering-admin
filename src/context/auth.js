import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = () => {
      const storedToken = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setAccessToken(storedToken);
        } catch (e) {
          localStorage.removeItem('user');
          localStorage.removeItem('access_token');
          setUser(null);
          setAccessToken(null);
        }
      }
      setLoadingInitial(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (username, password) => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch('http://localhost:8080/v1/login', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      const receivedAccessToken = data.access_token;
      const receivedUser = data.user || { username: username, role: 'admin' };

      localStorage.setItem('access_token', receivedAccessToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));

      setUser(receivedUser);
      setAccessToken(receivedAccessToken);
      console.log(receivedAccessToken)

      navigate('/');
      return receivedUser;

    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    
    setUser(null);
    setAccessToken(null);
    
    navigate('/login');
  };

  const value = { user, accessToken, login, logout, loadingInitial };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};