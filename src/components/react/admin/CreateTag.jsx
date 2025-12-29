import React, { useState } from 'react';
import axios from 'axios';

const CreateTag = ({ token, onCancel, onSuccess, showToast }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');

  const API_URL = (import.meta.env.PUBLIC_API_URL || '').replace(/\/$/, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!name.trim()) {
      setError('El nombre del tag es obligatorio.');
      setLoading(false);
      return;
    }

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      await axios.post(`${API_URL}/tags/`, { name }, { headers });

      if (showToast) showToast('¡Tag agregado con éxito!', 'success');
      onSuccess();

    } catch (err) {
      console.error(err);
      setError('Error al crear el tag.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#151030] p-8 rounded-2xl border border-white/10 max-w-2xl mx-auto shadow-card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Nuevo Tag</h2>
        <button onClick={onCancel} className="text-secondary hover:text-white transition-colors">✕ Cancelar</button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-white mb-2 font-medium">Nombre del Tag *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-[#100d25] border border-gray-600 rounded-lg p-3 text-white focus:border-[#915eff] outline-none"
            placeholder="Ej: Web, Mobile, Design..."
          />
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
          <button type="button" onClick={onCancel} className="px-6 py-2 text-white hover:bg-white/10 rounded-lg transition-colors">Cancelar</button>
          <button type="submit" disabled={loading} className="bg-[#915eff] hover:bg-[#7e4ee0] text-white px-8 py-2 rounded-lg font-bold shadow-lg shadow-purple-500/20 disabled:opacity-50 transition-all">
            {loading ? 'Guardando...' : 'Guardar Tag'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTag;