import React, { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';

const AdminLayout = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Revisamos si ya hay un token guardado
    const storedToken = localStorage.getItem('admin_token');
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  if (loading) return <div className="text-white text-center mt-20">Cargando...</div>;

  // 2. LA LÓGICA CLAVE:
  // Si NO hay token --> Muestra LOGIN
  // Si SÍ hay token --> Muestra DASHBOARD
  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return <Dashboard onLogout={handleLogout} token={token} />;
};

export default AdminLayout;