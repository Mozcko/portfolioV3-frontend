import React, { useState } from 'react';
import axios from 'axios';

const CreateTechnology = ({ token, onCancel, onSuccess, showToast }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estados del formulario
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(null);

  const API_URL = import.meta.env.PUBLIC_API_URL || '/api';

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setIcon(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // --- AGREGA ESTO PARA DEPURAR ---
    console.log("Token recibido en CreateTechnology:", token);
    // --------------------------------

    if (!icon) {
      setError('Debes subir un icono para la tecnología.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('icon', icon);

      // Verificamos el header antes de enviar
      const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
      };
      console.log("Headers enviados:", headers); // --- DEBUG ---

      await axios.post(`${API_URL}/technologies/`, formData, { headers });

      if (showToast) showToast('¡Tecnología agregada con éxito!', 'success');
      onSuccess();

    } catch (err) {
      console.error("Error completo:", err); // Muestra el error completo
      console.log("Respuesta del servidor:", err.response); // Muestra qué dice el backend
      
      if (err.response && err.response.status === 401) {
        setError('Tu sesión ha expirado. Por favor cierra sesión y vuelve a entrar.');
      } else {
        setError('Error al crear la tecnología. Revisa la consola.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#151030] p-8 rounded-2xl border border-white/10 max-w-2xl mx-auto shadow-card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Nueva Tecnología</h2>
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
          <label className="block text-white mb-2 font-medium">Nombre de la Tecnología *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-[#100d25] border border-gray-600 rounded-lg p-3 text-white focus:border-[#915eff] outline-none"
            placeholder="Ej: React, TypeScript, Blender..."
          />
        </div>

        {/* Archivo (Icono) */}
        <div>
          <label className="block text-white mb-2 font-medium">Icono (PNG/SVG) *</label>
          <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-6 hover:border-[#915eff] transition-colors bg-[#100d25] text-center">
            <input
              type="file"
              onChange={handleFileChange}
              required
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="pointer-events-none flex flex-col items-center">
              {icon ? (
                <span className="text-[#915eff] font-bold break-all">Archivo: {icon.name}</span>
              ) : (
                <>
                  <svg className="w-8 h-8 text-secondary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <span className="text-secondary text-sm">Sube el logo de la tecnología</span>
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
            {loading ? 'Subiendo...' : 'Guardar Tecnología'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTechnology;