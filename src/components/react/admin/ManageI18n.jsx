import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageI18n = ({ token, showToast }) => {
  const [language, setLanguage] = useState('es'); // 'es' | 'en'
  const [jsonContent, setJsonContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = (import.meta.env.PUBLIC_API_URL || '').replace(/\/$/, '');

  useEffect(() => {
    fetchData();
  }, [language]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/i18n/${language}`);
      // Formateamos el JSON para que sea legible en el textarea
      setJsonContent(JSON.stringify(response.data, null, 2));
    } catch (err) {
      console.error("Error fetching i18n:", err);
      setError('No se pudieron cargar las traducciones.');
      setJsonContent('{}');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    
    let parsedData;
    try {
      parsedData = JSON.parse(jsonContent);
    } catch (e) {
      setError('JSON inválido. Por favor verifica la sintaxis (comillas, comas, llaves).');
      setLoading(false);
      return;
    }

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Usamos PUT para actualizar el recurso completo
      await axios.put(`${API_URL}/i18n/${language}`, parsedData, { headers });
      
      if (showToast) showToast(`¡Traducciones (${language.toUpperCase()}) actualizadas!`, 'success');
    } catch (err) {
      console.error("Error saving i18n:", err);
      setError('Error al guardar. Revisa la consola.');
      if (showToast) showToast('Error al guardar', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#151030] p-8 rounded-2xl border border-white/10 shadow-card max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestión de Textos (i18n)</h2>
          <p className="text-secondary text-sm">Edita los textos de la aplicación directamente en formato JSON.</p>
        </div>
        
        {/* Selector de Idioma */}
        <div className="flex bg-[#100d25] p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setLanguage('es')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              language === 'es' 
                ? 'bg-[#915eff] text-white shadow-lg' 
                : 'text-secondary hover:text-white'
            }`}
          >
            <span>🇽</span> Español
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              language === 'en' 
                ? 'bg-[#915eff] text-white shadow-lg' 
                : 'text-secondary hover:text-white'
            }`}
          >
            <span>🇺🇸</span> English
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="relative">
        <label className="block text-white mb-2 font-medium">Contenido JSON ({language.toUpperCase()})</label>
        <textarea
          value={jsonContent}
          onChange={(e) => setJsonContent(e.target.value)}
          className="w-full h-[600px] bg-[#050816] border border-gray-600 rounded-lg p-4 text-white font-mono text-sm focus:border-[#915eff] outline-none custom-scrollbar resize-y"
          spellCheck="false"
        />
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-white/10 mt-6">
        <button
          onClick={fetchData}
          className="px-6 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          disabled={loading}
        >
          Descartar Cambios
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-[#915eff] hover:bg-[#7e4ee0] text-white px-8 py-2 rounded-lg font-bold shadow-lg shadow-purple-500/20 disabled:opacity-50 transition-all"
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );
};

export default ManageI18n;