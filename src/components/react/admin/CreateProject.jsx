import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
// 1. Importamos el componente de crear tecnología
import CreateTechnology from './CreateTechnology';

const CreateProject = ({ token, onCancel, onSuccess, initialData, showToast }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [title, setTitle] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descEs, setDescEs] = useState('');
  const [image, setImage] = useState(null);

  const [availableTechs, setAvailableTechs] = useState([]);
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [loadingTechs, setLoadingTechs] = useState(true);

  // 2. Estado para controlar el Modal
  const [showTechModal, setShowTechModal] = useState(false);
  const [techModalMode, setTechModalMode] = useState('list'); // 'list' | 'create'
  const [techToDelete, setTechToDelete] = useState(null);

  // Aseguramos que API_URL no tenga slash al final para evitar dobles slashes (//)
  const API_URL = (import.meta.env.PUBLIC_API_URL || '').replace(/\/$/, '');

  // Helper para construir la URL completa de la imagen (Soluciona los errores 404)
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

  // 3. Convertimos la carga de datos en una función reutilizable (useCallback)
  const fetchTechnologies = useCallback(async () => {
    try {
      setLoadingTechs(true);
      const response = await axios.get(`${API_URL}/technologies/`);
      setAvailableTechs(response.data);
    } catch (err) {
      console.error("Error cargando tecnologías:", err);
      setError('No se pudieron cargar las tecnologías.');
    } finally {
      setLoadingTechs(false);
    }
  }, [API_URL]);

  // Cargar al inicio
  useEffect(() => {
    fetchTechnologies();
  }, [fetchTechnologies]);

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescEn(initialData.description_en || '');
      setDescEs(initialData.description_es || '');
      if (initialData.technologies) {
        setSelectedTechs(initialData.technologies.map(t => t.id));
      }
    }
  }, [initialData]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const toggleTech = (techId) => {
    if (selectedTechs.includes(techId)) {
      setSelectedTechs(selectedTechs.filter(id => id !== techId));
    } else {
      setSelectedTechs([...selectedTechs, techId]);
    }
  };

  // 4. Función mágica: Se ejecuta cuando terminas de crear la tecnología en el Modal
  const handleTechCreated = () => {
    setTechModalMode('list'); // Volver a la lista en lugar de cerrar
    fetchTechnologies(); // Recarga la lista para que aparezca la nueva
  };

  // Función para eliminar tecnología desde el modal
  const handleDeleteTechClick = (id) => {
    setTechToDelete(id);
  };

  const confirmDeleteTech = async () => {
    if (!techToDelete) return;
    try {
      await axios.delete(`${API_URL}/technologies/${techToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (showToast) showToast('Tecnología eliminada', 'success');
      fetchTechnologies();
      if (selectedTechs.includes(techToDelete)) setSelectedTechs(prev => prev.filter(t => t !== techToDelete));
    } catch (error) {
      console.error(error);
      if (showToast) showToast('Error al eliminar tecnología', 'error');
    } finally {
      setTechToDelete(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!image && !initialData) {
      setError('La imagen del proyecto es obligatoria.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description_en', descEn);
      formData.append('description_es', descEs);
      
      if (image) {
        formData.append('image', image);
      }
      
      if (selectedTechs.length > 0) {
        formData.append('technology_ids', selectedTechs.join(','));
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        // IMPORTANTE: No definir Content-Type manualmente con FormData, Axios lo hace mejor
      };

      if (initialData) {
        // Modo Edición (PUT)
        // Quitamos el slash final '/' porque el servidor redirige si lo ponemos
        await axios.put(`${API_URL}/projects/${initialData.id}`, formData, { headers });
        if (showToast) showToast('¡Proyecto actualizado con éxito!', 'success');
      } else {
        // Modo Creación (POST)
        await axios.post(`${API_URL}/projects/`, formData, { headers });
        if (showToast) showToast('¡Proyecto creado con éxito!', 'success');
      }
      
      onSuccess();

    } catch (err) {
      console.error(err);
      setError('Error al crear el proyecto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative"> {/* Necesario relative para el modal */}
      
      {/* --- MODAL PARA ADMINISTRAR TECNOLOGÍAS --- */}
      {showTechModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl">
            {techModalMode === 'list' ? (
              <div className="bg-[#151030] p-8 rounded-2xl border border-white/10 shadow-card relative">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white">Administrar Tecnologías</h3>
                  <button onClick={() => setShowTechModal(false)} className="text-secondary hover:text-white">✕</button>
                </div>

                {/* Modal de confirmación interno */}
                {techToDelete && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl">
                    <div className="bg-[#100d25] p-6 rounded-xl border border-white/10 max-w-sm w-full text-center mx-4 shadow-2xl">
                      <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">🗑️</span>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">¿Eliminar tecnología?</h4>
                      <p className="text-secondary text-sm mb-4">Esta acción no se puede deshacer.</p>
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => setTechToDelete(null)} className="px-3 py-1.5 text-white hover:bg-white/10 rounded-lg text-sm transition-colors">Cancelar</button>
                        <button onClick={confirmDeleteTech} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">Eliminar</button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="max-h-[400px] overflow-y-auto custom-scrollbar mb-6 space-y-2 pr-2">
                  {loadingTechs ? (
                    <p className="text-secondary text-center">Cargando...</p>
                  ) : availableTechs.length === 0 ? (
                    <p className="text-secondary text-center">No hay tecnologías registradas.</p>
                  ) : (
                    availableTechs.map(tech => (
                      <div key={tech.id} className="flex items-center justify-between bg-[#100d25] p-3 rounded-lg border border-white/5 hover:border-[#915eff]/30 transition-colors">
                        <div className="flex items-center gap-3">
                          {tech.icon && (
                            <img src={getImageUrl(tech.icon)} alt={tech.name} className="w-8 h-8 object-contain" />
                          )}
                          <span className="text-white font-medium">{tech.name}</span>
                        </div>
                        <button 
                          onClick={() => handleDeleteTechClick(tech.id)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded transition-colors"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex justify-end gap-3 border-t border-white/10 pt-6">
                  <button onClick={() => setShowTechModal(false)} className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors">Cerrar</button>
                  <button onClick={() => setTechModalMode('create')} className="bg-[#915eff] hover:bg-[#7e4ee0] text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-purple-500/20 transition-all">+ Nueva Tecnología</button>
                </div>
              </div>
            ) : (
              <CreateTechnology token={token} onCancel={() => setTechModalMode('list')} onSuccess={handleTechCreated} showToast={showToast} />
            )}
          </div>
        </div>
      )}

      <div className="bg-[#151030] p-8 rounded-2xl border border-white/10 max-w-4xl mx-auto shadow-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{initialData ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
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
            <label className="block text-white mb-2 font-medium">Nombre del Proyecto *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-[#100d25] border border-gray-600 rounded-lg p-3 text-white focus:border-[#915eff] outline-none"
              placeholder="Ej: E-Commerce Platform"
            />
          </div>

          {/* Descripciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white mb-2 font-medium">Descripción (Inglés) *</label>
              <textarea
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                required
                rows="4"
                className="w-full bg-[#100d25] border border-gray-600 rounded-lg p-3 text-white focus:border-[#915eff] outline-none"
              />
            </div>
            <div>
              <label className="block text-white mb-2 font-medium">Descripción (Español) *</label>
              <textarea
                value={descEs}
                onChange={(e) => setDescEs(e.target.value)}
                required
                rows="4"
                className="w-full bg-[#100d25] border border-gray-600 rounded-lg p-3 text-white focus:border-[#915eff] outline-none"
              />
            </div>
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-white mb-2 font-medium">Imagen de Portada *</label>
            <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-6 bg-[#100d25] text-center flex flex-col items-center justify-center min-h-[100px]">
              <input
                type="file"
                onChange={handleImageChange}
                required={!initialData}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="pointer-events-none text-center w-full">
                {image ? (
                  <span className="text-[#915eff] font-bold break-all">Archivo: {image.name}</span>
                ) : initialData && (initialData.image_route || initialData.image) ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={getImageUrl(initialData.image_route || initialData.image)} 
                      alt="Actual" 
                      className="h-32 object-contain mb-2 rounded border border-white/10"
                    />
                    <span className="text-secondary text-xs bg-black/50 px-2 py-1 rounded">Click en cualquier lugar para cambiar la imagen</span>
                  </div>
                ) : (
                  <span className="text-secondary text-sm">Click para subir imagen</span>
                )}
              </div>
            </div>
          </div>

          {/* Selector de Tecnologías con Botón "+" */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-white font-medium">Tecnologías Utilizadas *</label>
              
              {/* BOTÓN PARA ABRIR MODAL */}
              <button 
                type="button" // Importante type="button" para no enviar el formulario
                onClick={() => {
                  setTechModalMode('list');
                  setShowTechModal(true);
                }}
                className="text-xs bg-[#915eff] hover:bg-[#7e4ee0] text-white px-3 py-1 rounded transition-colors flex items-center gap-1"
              >
                <span>⚙️</span> Administrar
              </button>
            </div>
            
            {loadingTechs ? (
              <p className="text-secondary text-sm">Cargando tecnologías...</p>
            ) : availableTechs.length === 0 ? (
              <div className="bg-yellow-500/10 border border-yellow-500/50 p-3 rounded text-yellow-200 text-sm">
                No hay tecnologías. ¡Crea una con el botón de arriba!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {availableTechs.map((tech) => {
                  const isSelected = selectedTechs.includes(tech.id);
                  return (
                    <div 
                      key={tech.id}
                      onClick={() => toggleTech(tech.id)}
                      className={`cursor-pointer p-2 rounded-lg border flex items-center gap-2 transition-all ${
                        isSelected 
                          ? 'bg-[#915eff]/20 border-[#915eff]' 
                          : 'bg-[#100d25] border-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-[#915eff] border-[#915eff]' : 'border-gray-500'
                      }`}>
                        {isSelected && <span className="text-white text-[10px]">✓</span>}
                      </div>
                      {/* Renderizamos el icono usando el helper */}
                      {tech.icon && (
                        <img 
                          src={getImageUrl(tech.icon)} 
                          alt={tech.name} 
                          className="w-5 h-5 object-contain"
                        />
                      )}
                      <span className="text-white text-xs truncate select-none">{tech.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Botones Finales */}
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
              {loading ? 'Guardando...' : (initialData ? 'Actualizar Proyecto' : 'Crear Proyecto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;