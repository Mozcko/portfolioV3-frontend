import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateCertificate = ({ token, onCancel, onSuccess, initialData, showToast }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estados para los campos
  const [title, setTitle] = useState('');
  const [school, setSchool] = useState('');
  const [link, setLink] = useState('');
  const [file, setFile] = useState(null); // Aquí guardaremos el archivo real

  const API_URL = (import.meta.env.PUBLIC_API_URL || '').replace(/\/$/, '');

  // Helper para construir la URL completa de la imagen/archivo
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
      setTitle(initialData.title || '');
      setSchool(initialData.school || '');
      setLink(initialData.link || '');
    }
  }, [initialData]);

  const handleFileChange = (e) => {
    // Guardamos el primer archivo seleccionado
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!file && !initialData) {
      setError('Debes subir un archivo de certificado (imagen/pdf).');
      setLoading(false);
      return;
    }

    try {
      // 1. Crear un objeto FormData (Obligatorio para enviar archivos)
      const formData = new FormData();
      formData.append('title', title);
      formData.append('school', school);
      // Solo enviamos el link si el usuario escribió algo
      if (link) formData.append('link', link); 
      
      if (file) {
        formData.append('file', file); // Solo enviamos archivo si el usuario subió uno nuevo
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        // No definir Content-Type manualmente con FormData
      };

      // 2. Enviar al Backend
      if (initialData) {
        // Modo Edición (PUT)
        await axios.put(`${API_URL}/certificates/${initialData.id}`, formData, { headers });
        if (showToast) showToast('¡Certificado actualizado con éxito!', 'success');
      } else {
        // Modo Creación (POST)
        await axios.post(`${API_URL}/certificates/`, formData, { headers });
        if (showToast) showToast('¡Certificado subido con éxito!', 'success');
      }

      onSuccess();

    } catch (err) {
      console.error(err);
      setError('Error al subir el certificado. Verifica el tamaño del archivo o la conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#151030] p-8 rounded-2xl border border-white/10 max-w-3xl mx-auto shadow-card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{initialData ? 'Editar Certificado' : 'Nuevo Certificado'}</h2>
        <button onClick={onCancel} className="text-secondary hover:text-white transition-colors">✕ Cancelar</button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <div>
          <label className="block text-white mb-2 font-medium">Título del Certificado *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-[#100d25] border border-gray-600 rounded-lg p-3 text-white focus:border-[#915eff] outline-none"
            placeholder="Ej: AWS Certified Cloud Practitioner"
          />
        </div>

        {/* Institución */}
        <div>
          <label className="block text-white mb-2 font-medium">Institución / Escuela *</label>
          <input
            type="text"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            required
            className="w-full bg-[#100d25] border border-gray-600 rounded-lg p-3 text-white focus:border-[#915eff] outline-none"
            placeholder="Ej: Udemy, Coursera, Universidad..."
          />
        </div>

        {/* Link de Verificación */}
        <div>
          <label className="block text-white mb-2 font-medium">Link de Credencial (Opcional)</label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full bg-[#100d25] border border-gray-600 rounded-lg p-3 text-white focus:border-[#915eff] outline-none"
            placeholder="https://..."
          />
        </div>

        {/* Archivo (File Input) */}
        <div>
          <label className="block text-white mb-2 font-medium">Imagen del Certificado *</label>
          <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-6 hover:border-[#915eff] transition-colors bg-[#100d25] text-center flex flex-col items-center justify-center min-h-[100px]">
            <input
              type="file"
              onChange={handleFileChange}
              required={!initialData}
              accept="image/*,.pdf" // Aceptamos imágenes y PDF
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="pointer-events-none w-full">
              {file ? (
                <span className="text-[#915eff] font-bold break-all">Archivo: {file.name}</span>
              ) : initialData && (initialData.file || initialData.image) ? (
                <div className="flex flex-col items-center">
                  <img 
                    src={getImageUrl(initialData.file || initialData.image)} 
                    alt="Actual" 
                    className="h-32 object-contain mb-2 rounded border border-white/10"
                  />
                  <span className="text-secondary text-xs bg-black/50 px-2 py-1 rounded">Click para cambiar archivo</span>
                </div>
              ) : (
                <span className="text-secondary">Arrastra tu archivo o haz clic para subir</span>
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
            {loading ? 'Guardando...' : (initialData ? 'Actualizar Certificado' : 'Guardar Certificado')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCertificate;