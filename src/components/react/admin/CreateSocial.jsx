import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateSocial = ({ token, onCancel, onSuccess, initialData, showToast }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estados del formulario
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [file, setFile] = useState(null); // Icono de la red social

  const API_URL = (import.meta.env.PUBLIC_API_URL || '').replace(/\/$/, '');

  // Helper para construir la URL completa de la imagen
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    try {
      const urlObj = new URL(API_URL);
      return `${urlObj.origin}${path}`;
    } catch (e) {
      return path;
    }
  };

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setLink(initialData.link || '');
    }
  }, [initialData]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!file && !initialData) {
      setError('Debes subir el icono de la red social.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('link', link);
      
      if (file) {
        formData.append('file', file); // 'file' en Swagger
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        // No definir Content-Type manualmente con FormData
      };

      if (initialData) {
        // Modo Edición (PUT)
        await axios.put(`${API_URL}/socials/${initialData.id}`, formData, { headers });
        if (showToast) showToast('¡Red social actualizada con éxito!', 'success');
      } else {
        // Modo Creación (POST)
        await axios.post(`${API_URL}/socials/`, formData, { headers });
        if (showToast) showToast('¡Red social agregada con éxito!', 'success');
      }

      onSuccess();

    } catch (err) {
      console.error(err);
      setError('Error al crear. Revisa la conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#151030] p-8 rounded-2xl border border-white/10 max-w-2xl mx-auto shadow-card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{initialData ? 'Editar Red Social' : 'Nueva Red Social'}</h2>
        <button onClick={onCancel} className="text-secondary hover:text-white transition-colors">✕ Cancelar</button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-white mb-2 font-medium">Nombre *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-[#100d25] border border-gray-600 rounded-lg p-3 text-white focus:border-[#915eff] outline-none"
            placeholder="Ej: LinkedIn, GitHub, Twitter"
          />
        </div>

        {/* Link */}
        <div>
          <label className="block text-white mb-2 font-medium">Enlace (URL) *</label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
            className="w-full bg-[#100d25] border border-gray-600 rounded-lg p-3 text-white focus:border-[#915eff] outline-none"
            placeholder="https://..."
          />
        </div>

        {/* Archivo (Icono) */}
        <div>
          <label className="block text-white mb-2 font-medium">Icono *</label>
          <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-6 hover:border-[#915eff] transition-colors bg-[#100d25] text-center flex flex-col items-center justify-center min-h-[100px]">
            <input
              type="file"
              onChange={handleFileChange}
              required={!initialData}
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="pointer-events-none flex flex-col items-center w-full">
              {file ? (
                <span className="text-[#915eff] font-bold break-all">Archivo: {file.name}</span>
              ) : initialData && (initialData.file || initialData.image || initialData.icon) ? (
                <div className="flex flex-col items-center">
                  <img 
                    src={getImageUrl(initialData.file || initialData.image || initialData.icon)} 
                    alt="Actual" 
                    className="h-32 object-contain mb-2 rounded border border-white/10"
                  />
                  <span className="text-secondary text-xs bg-black/50 px-2 py-1 rounded">Click para cambiar icono</span>
                </div>
              ) : (
                <>
                  <svg className="w-8 h-8 text-secondary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                  <span className="text-secondary text-sm">Sube el logo de la red</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#915eff] hover:bg-[#7e4ee0] text-white px-8 py-2 rounded-lg font-bold shadow-lg shadow-purple-500/20 disabled:opacity-50 transition-all"
          >
            {loading ? 'Guardando...' : (initialData ? 'Actualizar Social' : 'Guardar Social')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSocial;