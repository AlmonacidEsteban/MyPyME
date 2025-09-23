import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token almacenado
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Aquí podrías hacer una petición para obtener los datos del usuario
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8000/auth/login/', {
        username,
        password
      });
      
      const { key } = response.data;
      localStorage.setItem('token', key);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:8000/auth/registration/', userData);
      const { key } = response.data;
      localStorage.setItem('token', key);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Error de registro:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isAuthenticated,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};