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
      const response = await fetch('https://khatering.shop/v1/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const loginData = await response.json();

      const authResponse = await fetch('https://khatering.shop/v1/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username }),
        credentials: 'include'
      });

      if (!authResponse.ok) {
        throw new Error('Auth service failed');
      }

      const tokenData = await authResponse.json();

      localStorage.setItem('access_token', tokenData.access_token);
      localStorage.setItem('user', JSON.stringify({ username }));

      setUser({ username });
      setAccessToken(tokenData.access_token);

      navigate('/');
      return { username };
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
