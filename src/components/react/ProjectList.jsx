import React, { useState, useMemo } from 'react';
import ProjectCard from './ProjectCard';
// 1. Importamos los componentes de Framer Motion
import { motion, AnimatePresence } from 'framer-motion';

const ProjectList = ({ projects, technologies, tags, lang, t = {} }) => {
  // Estado para la categoría principal de filtro: 'all', 'techs', 'tags'
  const [filterCategory, setFilterCategory] = useState('all');
  // Estado para el ID del filtro específico seleccionado (un ID de tecnología o tag)
  const [selectedFilterId, setSelectedFilterId] = useState(null);

  const handleCategoryChange = (category) => {
    setFilterCategory(category);
    // Resetea el filtro específico al cambiar de categoría principal
    setSelectedFilterId(null);
  };

  const filteredProjects = useMemo(() => {
    // Si no hay un filtro específico seleccionado, muestra todos los proyectos
    if (selectedFilterId === null) {
      return projects;
    }
    
    // Filtra según la categoría y el ID seleccionado
    if (filterCategory === 'techs') {
      return projects.filter(p => 
        p.technologies.some(t => t.id === selectedFilterId)
      );
    }
    if (filterCategory === 'tags') {
      return projects.filter(p => 
        p.tags.some(t => t.id === selectedFilterId)
      );
    }
    
    // Por defecto, muestra todos los proyectos
    return projects;
  }, [projects, filterCategory, selectedFilterId]);

  // Componente para las pestañas de filtro principal
  const MainFilterTab = ({ category, label }) => (
    <button
      onClick={() => handleCategoryChange(category)}
      className={`px-5 py-2 rounded-t-lg text-sm font-bold transition-all ${
        filterCategory === category
          ? 'bg-tertiary text-white'
          : 'bg-transparent text-secondary hover:bg-tertiary/50 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  // Componente para los botones de sub-filtro (tecnologías/tags)
  const SubFilterButton = ({ id, label }) => (
    <button
      onClick={() => setSelectedFilterId(id)}
      className={`px-4 py-2 rounded-full text-xs font-medium transition-all border ${
        selectedFilterId === id
          ? 'bg-[#915eff] text-white border-[#915eff]'
          : 'bg-tertiary text-secondary border-transparent hover:bg-white/10 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  // 2. Definimos variantes de animación para los contenedores y sus ítems
  const subFilterContainerVariants = {
    hidden: { opacity: 0, height: 0, marginBottom: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      marginBottom: '3rem', // mb-12
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    },
    exit: { opacity: 0, height: 0, marginBottom: 0 }
  };

  const subFilterItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div>
      {/* Pestañas de Filtro Principal */}
      <div className="flex justify-center border-b border-white/10 mb-8">
        <MainFilterTab category="all" label={t['projects.filter_everything'] || "Todos"}/>
        <MainFilterTab category="techs" label={t['projects.filter_technologies'] || "Filtrar por Tecnología"}/>
        <MainFilterTab category="tags" label={t['projects.filter_tags'] || "Filtrar por Tags"}/>
      </div>

      {/* Botones de Sub-Filtro (renderizado condicional) */}
      <div className="min-h-[40px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={filterCategory} // La clave cambia, disparando la animación de entrada/salida
            className="flex flex-wrap justify-center gap-2"
            variants={subFilterContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {filterCategory === 'techs' && (
              <>
                <motion.div variants={subFilterItemVariants}>
                  <SubFilterButton id={null} label={t['projects.filter_technologies_everything'] || "Todas las tecnologías"} />
                </motion.div>
                {technologies.map(tech => (
                  <motion.div variants={subFilterItemVariants} key={`tech-${tech.id}`}>
                    <SubFilterButton id={tech.id} label={tech.name} />
                  </motion.div>
                ))}
              </>
            )}

            {filterCategory === 'tags' && (
              <>
                <motion.div variants={subFilterItemVariants}>
                  <SubFilterButton id={null} label={t['projects.filter_tags_everything'] || "Todos los tags"} />
                </motion.div>
                {tags.map(tag => (
                  <motion.div variants={subFilterItemVariants} key={`tag-${tag.id}`}>
                    <SubFilterButton id={tag.id} label={`#${tag.name}`} />
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Project Cards Grid */}
      <motion.div layout className="flex flex-wrap justify-center gap-7">
        <AnimatePresence>
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
              <motion.div layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.4 }} key={project.id}>
                <ProjectCard project={project} lang={lang} />
              </motion.div>
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-secondary col-span-full py-10">
              <p>{t['projects.no_projects_found'] || 'No hay proyectos que coincidan con el filtro seleccionado.'}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ProjectList;