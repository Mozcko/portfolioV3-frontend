import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Importamos tus formularios
import CreateProject from './CreateProject';
import CreateCertificate from './CreateCertificate';
import CreateJob from './CreateJob';
import CreateSocial from './CreateSocial';
import ManageI18n from './ManageI18n';

const Dashboard = ({ onLogout, token }) => {
  // --- ESTADOS ---
  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'certificates', 'jobs', 'socials'
  const [viewState, setViewState] = useState('list'); // 'list', 'create', 'edit'
  const [items, setItems] = useState([]); // Lista de datos actuales
  const [editingItem, setEditingItem] = useState(null); // Item seleccionado para editar
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const API_URL = (import.meta.env.PUBLIC_API_URL || '/api').replace(/\/$/, '');

  // Helper para construir la URL completa de la imagen si viene relativa
  const getImageUrl = (path) => {
    if (!path) return null;
    // Si ya es una URL absoluta (http/https) o base64, la dejamos igual
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    
    try {
      // Intentamos obtener el origen (protocolo + dominio + puerto) de la API_URL
      const urlObj = new URL(API_URL);
      return `${urlObj.origin}${path}`;
    } catch (e) {
      // Si API_URL es relativa (ej: '/api'), devolvemos el path tal cual
      return path;
    }
  };

  // Helper para mostrar notificaciones Toast
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  // --- CONFIGURACIÓN DE PESTAÑAS ---
  const tabs = [
    { id: 'projects', label: 'Proyectos', icon: '🚀' },
    { id: 'certificates', label: 'Certificados', icon: '📜' },
    { id: 'jobs', label: 'Experiencia', icon: '💼' },
    { id: 'socials', label: 'Redes Sociales', icon: '🔗' },
    { id: 'i18n', label: 'Textos (i18n)', icon: '🌍' },
  ];

  // --- FUNCIÓN DE CARGA DE DATOS ---
  const fetchItems = useCallback(async () => {
    if (activeTab === 'i18n') return; // i18n se maneja internamente en su componente
    setLoading(true);
    try {
      // Llamada dinámica según la pestaña activa
      const response = await axios.get(`${API_URL}/${activeTab}/`);
      setItems(response.data);
    } catch (error) {
      console.error(`Error cargando ${activeTab}:`, error);
      // Si falla, dejamos la lista vacía
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, API_URL]);

  // Recargar cuando cambie la pestaña
  useEffect(() => {
    setViewState('list'); // Volver a la lista al cambiar pestaña
    fetchItems();
  }, [fetchItems]);

  // --- MANEJADORES DE ACCIONES ---

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await axios.delete(`${API_URL}/${activeTab}/${itemToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Actualizar lista localmente
      setItems(items.filter(item => item.id !== itemToDelete));
      setShowDeleteModal(false);
      setItemToDelete(null);
      showToast('Elemento eliminado correctamente', 'success');
    } catch (error) {
      console.error("Error eliminando:", error);
      showToast('Error al eliminar el elemento', 'error');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setViewState('edit');
  };

  const handleCreate = () => {
    setEditingItem(null);
    setViewState('create');
  };

  const handleFormSuccess = () => {
    setViewState('list');
    fetchItems(); // Recargar datos frescos
  };

  // --- RENDERIZADO DE LA LISTA (TABLA/TARJETAS) ---
  const renderList = () => {
    if (loading) return <div className="text-white p-10 text-center">Cargando datos...</div>;
    
    if (items.length === 0) {
      return (
        <div className="text-center py-20 bg-[#151030]/50 rounded-2xl border border-white/5 border-dashed">
          <p className="text-secondary mb-4">No hay elementos en esta sección todavía.</p>
          <button onClick={handleCreate} className="bg-[#915eff] text-white px-6 py-2 rounded-lg font-bold">
            + Crear el primero
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-[#151030] rounded-xl overflow-hidden border border-white/5 hover:border-[#915eff]/50 transition-all group">
            
            {/* Cabecera / Imagen del Item */}
            <div className="h-40 w-full bg-[#100d25] relative overflow-hidden">
               {/* Lógica para mostrar imagen según el tipo de dato */}
               {(item.image || item.image_url || item.image_route || item.icon || item.file) ? (
                 <img 
                   src={getImageUrl(item.image || item.image_url || item.image_route || item.icon || item.file)} 
                   alt={item.title || item.name} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-secondary">Sin imagen</div>
               )}
               
               {/* Botones Flotantes (Edit/Delete) */}
               <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                   onClick={() => handleEdit(item)}
                   className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg"
                   title="Editar"
                 >
                   ✏️
                 </button>
                 <button 
                   onClick={() => handleDeleteClick(item.id)}
                   className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg"
                   title="Eliminar"
                 >
                   🗑️
                 </button>
               </div>
            </div>

            {/* Información */}
            <div className="p-5">
              <h3 className="text-white font-bold text-lg truncate mb-1">
                {item.title || item.name}
              </h3>
              
              {/* Info específica según pestaña */}
              {activeTab === 'projects' && (
                <p className="text-secondary text-sm line-clamp-2">{item.description_es || item.description}</p>
              )}
              {activeTab === 'certificates' && (
                <p className="text-secondary text-sm">{item.school}</p>
              )}
              {activeTab === 'jobs' && (
                <div className="text-secondary text-xs flex gap-2 mt-2">
                    <span className="bg-white/5 px-2 py-1 rounded">{item.start_date}</span>
                    <span>-</span>
                    <span className="bg-white/5 px-2 py-1 rounded">{item.current_job ? 'Presente' : item.end_date}</span>
                </div>
              )}
               {activeTab === 'socials' && (
                <a href={item.link} target="_blank" className="text-[#915eff] text-sm hover:underline truncate block mt-1">{item.link}</a>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // --- RENDERIZADO DEL FORMULARIO ACTIVO ---
  const renderForm = () => {
    const commonProps = {
      token,
      onCancel: () => setViewState('list'),
      onSuccess: handleFormSuccess,
      initialData: viewState === 'edit' ? editingItem : null, // Pasamos data si es edit
      showToast // Pasamos la función del toast a los hijos
    };

    switch (activeTab) {
      case 'projects': return <CreateProject {...commonProps} />;
      case 'certificates': return <CreateCertificate {...commonProps} />;
      case 'jobs': return <CreateJob {...commonProps} />;
      case 'socials': return <CreateSocial {...commonProps} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#050816]">
      
      {/* --- TOAST NOTIFICATION (Esquina Inferior Derecha) --- */}
      {toast.show && (
        <div className={`fixed bottom-5 right-5 z-[100] px-6 py-3 rounded-lg shadow-xl border flex items-center gap-3 transition-all duration-300 ${
          toast.type === 'success' 
            ? 'bg-[#151030] border-green-500/50 text-green-400' 
            : 'bg-[#151030] border-red-500/50 text-red-400'
        }`}>
          <span className="text-xl">{toast.type === 'success' ? '✅' : '❌'}</span>
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
      
      {/* --- MODAL DE CONFIRMACIÓN DE ELIMINACIÓN --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#151030] p-6 rounded-2xl border border-white/10 max-w-md w-full shadow-card text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🗑️</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">¿Estás seguro?</h3>
            <p className="text-secondary mb-6">
              Esta acción eliminará el elemento permanentemente. No se puede deshacer.
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-bold shadow-lg shadow-red-500/20 transition-all"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* --- SIDEBAR DE PESTAÑAS --- */}
      <aside className="w-full md:w-64 bg-[#100d25] border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <h1 className="text-2xl font-bold text-white tracking-wider">Mozcko<span className="text-[#915eff]">Admin</span></h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                activeTab === tab.id 
                  ? 'bg-[#915eff] text-white shadow-lg shadow-purple-500/20' 
                  : 'text-secondary hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-white hover:bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl transition-all"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* --- ÁREA PRINCIPAL --- */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto h-screen custom-scrollbar">
        
        {/* Encabezado de la vista actual */}
        {viewState === 'list' && activeTab !== 'i18n' && (
           <div className="flex justify-between items-center mb-8">
             <div>
               <h2 className="text-3xl font-bold text-white capitalize">
                 {tabs.find(t => t.id === activeTab)?.label}
               </h2>
               <p className="text-secondary text-sm mt-1">Gestiona tus elementos</p>
             </div>
             <button 
               onClick={handleCreate}
               className="bg-[#915eff] hover:bg-[#7e4ee0] text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all hover:translate-y-[-2px]"
             >
               <span>+</span> Agregar Nuevo
             </button>
           </div>
        )}

        {/* Contenido Dinámico */}
        <div className="max-w-7xl mx-auto">
          {activeTab === 'i18n' ? (
            <ManageI18n token={token} showToast={showToast} />
          ) : (
            viewState === 'list' ? renderList() : renderForm()
          )}
        </div>

      </main>
    </div>
  );
};

export default Dashboard;