import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_URL = import.meta.env.PUBLIC_API_URL || '/api';

// Helper para headers de autenticación
const getAuthConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
});

// --- Componente Genérico para CRUD (Projects, Jobs, etc.) ---
const CrudSection = ({ title, endpoint, icon }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null); // null = list, {} = create, object = edit
  const [formData, setFormData] = useState(''); // JSON string for editing

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/${endpoint}`);
      setItems(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al cargar datos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [endpoint]);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este elemento?')) return;
    try {
      await axios.delete(`${API_URL}/${endpoint}/${id}`, getAuthConfig());
      fetchItems();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const data = JSON.parse(formData);
      // Detectar ID: puede ser _id (mongo) o id (sql)
      const id = editingItem._id || editingItem.id;
      
      if (id) {
        await axios.put(`${API_URL}/${endpoint}/${id}`, data, getAuthConfig());
      } else {
        await axios.post(`${API_URL}/${endpoint}`, data, getAuthConfig());
      }
      setEditingItem(null);
      fetchItems();
    } catch (err) {
      alert('Error al guardar: Verifique el formato JSON o la conexión.');
    }
  };

  const openEdit = (item) => {
    setEditingItem(item);
    // Excluir metadatos del JSON editable
    const { _id, __v, createdAt, updatedAt, ...rest } = item;
    setFormData(JSON.stringify(rest, null, 2));
  };

  const openCreate = () => {
    setEditingItem({});
    setFormData('{\n  "name": "Nuevo Elemento"\n}');
  };

  if (loading) return <div className="text-white p-6">Cargando {title}...</div>;

  return (
    <div className="bg-[#151030] p-6 rounded-2xl border border-white/5">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          {icon} {title}
        </h3>
        {!editingItem && (
          <button 
            onClick={openCreate}
            className="bg-[#915eff] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#7e4ee0] transition-colors"
          >
            + Nuevo
          </button>
        )}
      </div>

      {error && <div className="text-red-400 mb-4">{error}</div>}

      {editingItem ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="bg-[#050816] p-4 rounded-xl border border-white/10">
            <label className="block text-gray-400 text-sm mb-2">Datos (JSON)</label>
            <textarea
              value={formData}
              onChange={(e) => setFormData(e.target.value)}
              className="w-full h-64 bg-[#151030] text-white font-mono text-sm p-4 rounded-lg border border-gray-700 focus:border-[#915eff] outline-none"
            />
            <p className="text-xs text-gray-500 mt-2">Edita las propiedades en formato JSON.</p>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Guardar</button>
            <button type="button" onClick={() => setEditingItem(null)} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">Cancelar</button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center py-8">No hay elementos.</p>
          ) : (
            items.map((item, idx) => (
              <div key={item._id || item.id || idx} className="bg-[#050816] p-4 rounded-xl border border-white/5 hover:border-[#915eff]/50 transition-colors group relative">
                <pre className="text-gray-300 text-xs overflow-hidden h-32 mb-4 font-mono">
                  {JSON.stringify(item, null, 2)}
                </pre>
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => openEdit(item)} className="text-blue-400 hover:text-blue-300 text-sm">Editar</button>
                  <button onClick={() => handleDelete(item._id || item.id)} className="text-red-400 hover:text-red-300 text-sm">Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// --- Componente para I18n (in18) ---
const I18nManager = () => {
  const [languages, setLanguages] = useState([]);
  const [selectedLang, setSelectedLang] = useState(null);
  const [jsonContent, setJsonContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const res = await axios.get(`${API_URL}/in18`);
      setLanguages(res.data || []);
    } catch (err) {
      console.error("Error fetching languages", err);
    }
  };

  const handleLangSelect = async (lang) => {
    setSelectedLang(lang);
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/in18/${lang}`);
      setJsonContent(JSON.stringify(res.data, null, 2));
    } catch (err) {
      alert('Error cargando idioma');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const data = JSON.parse(jsonContent);
      await axios.put(`${API_URL}/in18/${selectedLang}`, data, getAuthConfig());
      alert('Idioma actualizado correctamente');
    } catch (err) {
      alert('Error al guardar: JSON inválido o error de servidor');
    }
  };

  return (
    <div className="bg-[#151030] p-6 rounded-2xl border border-white/5">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
        Internacionalización (in18)
      </h3>
      
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        {languages.map(lang => (
          <button
            key={lang}
            onClick={() => handleLangSelect(lang)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedLang === lang ? 'bg-[#915eff] text-white' : 'bg-[#050816] text-gray-400 hover:text-white'
            }`}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>

      {selectedLang && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-white">Cargando...</div>
          ) : (
            <>
              <textarea
                value={jsonContent}
                onChange={(e) => setJsonContent(e.target.value)}
                className="w-full h-96 bg-[#050816] text-white font-mono text-sm p-4 rounded-xl border border-gray-700 focus:border-[#915eff] outline-none"
              />
              <button 
                onClick={handleSave}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
              >
                Guardar Cambios en {selectedLang.toUpperCase()}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// --- Overview Component (Dynamic) ---
const Overview = () => {
  const [stats, setStats] = useState([
    { title: 'Proyectos', value: '-', endpoint: 'projects', color: 'from-blue-500 to-cyan-500' },
    { title: 'Tecnologías', value: '-', endpoint: 'technologies', color: 'from-purple-500 to-pink-500' },
    { title: 'Certificados', value: '-', endpoint: 'certificates', color: 'from-orange-500 to-red-500' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      const newStats = await Promise.all(stats.map(async (stat) => {
        try {
          const res = await axios.get(`${API_URL}/${stat.endpoint}`);
          return { ...stat, value: Array.isArray(res.data) ? res.data.length : 0 };
        } catch {
          return { ...stat, value: 'Err' };
        }
      }));
      setStats(newStats);
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-[#151030] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
          <h3 className="text-gray-400 text-sm font-medium relative z-10">{stat.title}</h3>
          <p className="text-3xl font-bold text-white mt-2 relative z-10">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

// --- Componente Principal Dashboard ---

const Dashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { 
      id: 'overview', 
      label: 'Resumen', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    },
    { 
      id: 'projects', 
      label: 'Proyectos', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    },
    { 
      id: 'technologies', 
      label: 'Tecnologías', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    },
    { 
      id: 'jobs', 
      label: 'Experiencia', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    },
    { 
      id: 'certificates', 
      label: 'Certificados', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    },
    { 
      id: 'socials', 
      label: 'Redes Sociales', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    },
    { 
      id: 'in18', 
      label: 'Idiomas (i18n)', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#050816]">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-[#151030] border-r border-white/5 fixed h-full z-20">
        <div className="p-6 border-b border-white/5">
          <h1 className="text-2xl font-bold text-white tracking-wider">
            Mozcko<span className="text-[#915eff]">.</span>
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeSection === item.id 
                  ? 'bg-[#915eff] text-white shadow-lg shadow-[#915eff]/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <svg className={`w-5 h-5 ${activeSection === item.id ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {item.icon}
              </svg>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#151030] border-b border-white/5 p-4 flex justify-between items-center z-30">
        <h1 className="text-xl font-bold text-white">Mozcko<span className="text-[#915eff]">.</span></h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#050816] z-20 pt-20 px-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl ${
                  activeSection === item.id ? 'bg-[#915eff] text-white' : 'text-gray-400'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">{item.icon}</svg>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-red-400 mt-4 border border-red-500/20">
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-24 md:pt-8 overflow-y-auto min-h-screen">
        <header className="mb-8 hidden md:block">
          <h2 className="text-3xl font-bold text-white capitalize">{menuItems.find(i => i.id === activeSection)?.label}</h2>
          <p className="text-gray-400 mt-1">Bienvenido al panel de administración.</p>
        </header>

        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeSection === 'overview' && <Overview />}
          {activeSection === 'in18' && <I18nManager />}
          {['projects', 'technologies', 'jobs', 'certificates', 'socials'].includes(activeSection) && (
            <CrudSection 
              title={menuItems.find(i => i.id === activeSection).label} 
              endpoint={activeSection} 
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">{menuItems.find(i => i.id === activeSection).icon}</svg>} 
            />
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;