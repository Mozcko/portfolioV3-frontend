import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Variable de entorno
  const API_URL = import.meta.env.PUBLIC_API_URL || '/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      const response = await axios.post(`${API_URL}/auth/login`, params);

      const token = response.data.token || response.data.access_token;
      
      if (token) {
        localStorage.setItem('admin_token', token);
        onLoginSuccess(token);
      } else {
        setError('El servidor no devolvió un token válido.');
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'ERR_NETWORK') {
        setError('Error de conexión: El servidor bloqueó la solicitud (CORS) o está caído.');
      } else if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          setError('Usuario o contraseña incorrectos.');
        } else if (err.response.status === 422) {
          const msg = err.response.data?.message || err.response.data?.error || 'Datos inválidos (422).';
          setError(Array.isArray(msg) ? msg.join(', ') : String(msg));
        } else {
          setError(`Error del servidor: ${err.response.status}`);
        }
      } else {
        setError('Ocurrió un error inesperado. Inténtalo más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050816] px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm space-y-6"
      >
        
        {/* Cabecera con Icono y Título */}
        <div className="flex flex-col items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#915eff]">
            {/* Icono de Candado SVG */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="h-6 w-6 text-white"
            >
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="mt-4 text-center text-2xl font-medium tracking-tight text-white">
            Admin Panel
          </h2>
        </div>

        {/* Tarjeta del Formulario */}
        <div className="bg-[#151030] px-6 py-8 shadow-xl rounded-lg border border-white/5 sm:px-10">
          
          {/* Mensaje de Error */}
          {error && (
            <div className="mb-4 rounded-md bg-red-500/10 border border-red-500/50 p-3 text-sm text-red-200 text-center">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Input Username con Floating Label */}
            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-white bg-[#050816] rounded-lg border border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-[#915eff] peer"
                placeholder=" "
              />
              <label
                htmlFor="username"
                className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#050816] px-2 peer-focus:px-2 peer-focus:text-[#915eff] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 cursor-text"
              >
                Usuario
              </label>
            </div>

            {/* Input Password con Floating Label */}
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-white bg-[#050816] rounded-lg border border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-[#915eff] peer"
                placeholder=" "
              />
              <label
                htmlFor="password"
                className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[#050816] px-2 peer-focus:px-2 peer-focus:text-[#915eff] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 cursor-text"
              >
                Contraseña
              </label>
            </div>

            {/* Checkbox Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-gray-600 bg-[#050816] text-[#915eff] focus:ring-[#915eff] accent-[#915eff]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Recordarme
              </label>
            </div>

            {/* Botón Submit */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-md bg-[#915eff] px-4 py-2 text-sm font-medium text-white hover:bg-[#7e4ee0] focus:outline-none focus:ring-2 focus:ring-[#915eff] focus:ring-offset-2 focus:ring-offset-[#151030] disabled:opacity-50 transition-all uppercase tracking-wider"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verificando...
                  </span>
                ) : (
                  'Ingresar'
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Footer Copyright */}
        <p className="mt-8 text-center text-xs text-gray-500">
          Copyright © Mozcko Portfolio {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
};

export default Login;