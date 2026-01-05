import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "./ProjectCard";

const ProjectList = ({ projects = [], t = {}, lang }) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const INITIAL_COUNT = 6;

  // 1. OBTENER LISTAS SEPARADAS
  // Tecnologías únicas
  const techFilters = Array.from(new Set(
    projects.flatMap(p => p.technologies ? p.technologies.map(tech => tech.name) : [])
  )).sort();

  // Tags únicos
  const tagFilters = Array.from(new Set(
    projects.flatMap(p => p.tags ? p.tags.map(tag => tag.name) : [])
  )).sort();

  // 2. LÓGICA DE FILTRADO (Se mantiene igual, busca en ambos lados)
  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter(project => {
        const matchTag = project.tags?.some(tag => tag.name === activeFilter);
        const matchTech = project.technologies?.some(tech => tech.name === activeFilter);
        return matchTag || matchTech;
      });

  const visibleProjects = showAll ? filteredProjects : filteredProjects.slice(0, INITIAL_COUNT);

  useEffect(() => {
    setShowAll(false);
  }, [activeFilter]);

  // Componente de Botón Reutilizable para mantener el código limpio
  const FilterButton = ({ name, label }) => (
    <button
      onClick={() => setActiveFilter(name)}
      className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-300 border ${
        activeFilter === name
          ? "bg-[#915eff] text-white border-[#915eff] shadow-md shadow-purple-500/30"
          : "bg-tertiary text-secondary border-white/10 hover:text-white hover:border-white/50"
      }`}
    >
      {label || name}
    </button>
  );

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* --- SECCIÓN DE FILTROS --- */}
      <div className="w-full max-w-4xl mb-12 flex flex-col gap-6">
        
        {/* Botón Principal: Ver Todo */}
        <div className="flex justify-center">
             <FilterButton name="All" label={lang === 'es' ? 'Ver Todo' : 'View All'} />
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-start md:items-center">
            
            {/* GRUPO 1: TECNOLOGÍAS */}
            {techFilters.length > 0 && (
                <div className="flex flex-col items-center md:items-end w-full">
                    <h3 className="text-white text-sm font-bold mb-3 uppercase tracking-wider opacity-70">
                        {lang === 'es' ? 'Tecnologías' : 'Tech Stack'}
                    </h3>
                    <div className="flex flex-wrap justify-center md:justify-end gap-2">
                        {techFilters.map(tech => (
                            <FilterButton key={tech} name={tech} />
                        ))}
                    </div>
                </div>
            )}

            {/* Separador vertical en desktop */}
            <div className="hidden md:block w-[1px] h-16 bg-white/10"></div>

            {/* GRUPO 2: TAGS */}
            {tagFilters.length > 0 && (
                <div className="flex flex-col items-center md:items-start w-full">
                    <h3 className="text-white text-sm font-bold mb-3 uppercase tracking-wider opacity-70">
                        {lang === 'es' ? 'Categorías' : 'Categories'}
                    </h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        {tagFilters.map(tag => (
                            <FilterButton key={tag} name={tag} />
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* --- GRID DE PROYECTOS --- */}
      <motion.div 
        layout 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 w-full"
      >
        <AnimatePresence mode="popLayout">
          {visibleProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ProjectCard {...project} t={t} lang={lang} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {/* Mensaje Sin Resultados */}
      {visibleProjects.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-10">
            <p className="text-secondary text-lg">
                No projects found for: <span className="text-[#915eff] font-bold">{activeFilter}</span>
            </p>
            <button onClick={() => setActiveFilter("All")} className="mt-4 text-white underline hover:text-[#915eff]">
                Clear filters
            </button>
        </motion.div>
      )}

      {/* Botón Ver Más */}
      {filteredProjects.length > INITIAL_COUNT && (
        <motion.div layout className="mt-12 w-full flex justify-center">
            <button
            onClick={() => setShowAll(!showAll)}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 px-8 rounded-full transition-all flex items-center gap-2 text-sm uppercase tracking-wider"
            >
            {showAll ? (
                <>{t["general.show_less"] || "Show Less"} ↑</>
            ) : (
                <>{t["general.view_all"] || "View All"} ({filteredProjects.length - INITIAL_COUNT}+) ↓</>
            )}
            </button>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectList;