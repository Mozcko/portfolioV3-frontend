import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateJob = ({ token, onCancel, onSuccess, initialData, showToast }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estados del formulario
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(''); // Formato esperado: "YYYY-MM"
  const [endDate, setEndDate] = useState('');     // Formato esperado: "YYYY-MM"
  const [currentJob, setCurrentJob] = useState(false);
  const [file, setFile] = useState(null);

  const API_URL = (import.meta.env.PUBLIC_API_URL || '').replace(/\/$/, '');

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

  // Helper para cortar la fecha "YYYY-MM-DD" a "YYYY-MM" para el input
  const formatForInput = (dateString) => {
    if (!dateString) return '';
    // Si viene como "2023-05-15T00:00:00" o "2023-05-15" tomamos los primeros 7 caracteres
    return dateString.substring(0, 7); 
  };

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      // Convertimos las fechas al formato del input type="month"
      setStartDate(formatForInput(initialData.start_date));
      setEndDate(formatForInput(initialData.end_date));
      setCurrentJob(initialData.current_job || false);
    }
  }, [initialData]);

  // Efecto para limpiar fecha de fin si es trabajo actual
  useEffect(() => {
    if (currentJob) {
      setEndDate('');
    }
  }, [currentJob]);

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
      setError('Debes subir el logo de la empresa.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      
      // Enviamos el string directo "YYYY-MM"
      // El backend lo recibirá como string y tu Timeline lo entenderá perfecto
      formData.append('start_date', startDate); 
      
      if (currentJob) {
        // Si es trabajo actual, no enviamos end_date o enviamos vacío
      } else {
        formData.append('end_date', endDate);
      }

      formData.append('current_job', currentJob);
      
      if (file) {
        formData.append('file', file);
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      if (initialData) {
        await axios.put(`${API_URL}/jobs/${initialData.id}`, formData, { headers });
        if (showToast) showToast('¡Experiencia actualizada con éxito!', 'success');
      } else {
        await axios.post(`${API_URL}/jobs/`, formData, { headers });
        if (showToast) showToast('¡Experiencia laboral agregada con éxito!', 'success');
      }
      
      onSuccess();

    } catch (err) {
      console.error(err);
      setError('Error al guardar el trabajo. Revisa los campos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#151030] p-8 rounded-2xl border border-white/10 max-w-3xl mx-auto shadow-card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{initialData ? 'Editar Experiencia' : 'Nueva Experiencia'}</h2>
        <button onClick={onCancel} className="text-secondary hover:text-white transition-colors">✕ Cancelar</button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título del Puesto */}
        <div>
          <label className="block text-white mb-2 font-medium">Título / Puesto *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-[#100d25] border border-gray-600 rounded-lg p-3 text-white focus:border-[#915eff] outline-none"
            placeholder="Ej: Senior Frontend Developer"
          />
        </div>

        {/* Fechas con type="month" */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white mb-2 font-medium">Fecha de Inicio *</label>
            <input
              type="month" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full bg-[#100d25] border border-gray-600 rounded-lg p-3 text-white focus:border-[#915eff] outline-none [color-scheme:dark]"
            />
            <p className="text-xs text-secondary mt-1">Selecciona Mes y Año</p>
          </div>
          
          <div>
            <label className="block text-white mb-2 font-medium">Fecha de Fin</label>
            <input
              type="month"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={currentJob}
              required={!currentJob} // Requerido solo si no es el trabajo actual
              className={`w-full bg-[#100d25] border border-gray-600 rounded-lg p-3 text-white focus:border-[#915eff] outline-none [color-scheme:dark] ${currentJob ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </div>
        </div>

        {/* Checkbox Trabajo Actual */}
        <div className="flex items-center gap-3">
          <input
            id="current_job"
            type="checkbox"
            checked={currentJob}
            onChange={(e) => setCurrentJob(e.target.checked)}
            className="w-5 h-5 accent-[#915eff] rounded border-gray-600 bg-[#100d25]"
          />
          <label htmlFor="current_job" className="text-white cursor-pointer select-none">
            Actualmente trabajo aquí
          </label>
        </div>

        {/* Logo de la Empresa */}
        <div>
          <label className="block text-white mb-2 font-medium">Logo de la Empresa *</label>
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
              ) : initialData && (initialData.file || initialData.image) ? (
                <div className="flex flex-col items-center">
                  <img 
                    src={getImageUrl(initialData.file || initialData.image)} 
                    alt="Actual" 
                    className="h-32 object-contain mb-2 rounded border border-white/10"
                  />
                  <span className="text-secondary text-xs bg-black/50 px-2 py-1 rounded">Click para cambiar logo</span>
                </div>
              ) : (
                <>
                  <svg className="w-8 h-8 text-secondary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  <span className="text-secondary text-sm">Sube el logo de la compañia</span>
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
            {loading ? 'Guardando...' : (initialData ? 'Actualizar Trabajo' : 'Guardar Trabajo')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;