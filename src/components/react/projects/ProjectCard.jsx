import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
// Asegúrate de que esta ruta sea correcta según tu estructura actual
import githubIcon from '../../../assets/github.svg';
import linkIcon from '../../../assets/link.svg';

// 1. CAMBIO: Recibimos las propiedades directamente (destructuring) en lugar del objeto "project"
const ProjectCard = ({ 
  title, 
  description_es, 
  description_en, 
  image_route, 
  repo_url, 
  project_url, 
  technologies = [], // Valor por defecto para evitar errores si viene vacío
  tags = [], 
  lang = 'es' 
}) => {
  
  const [isExpanded, setIsExpanded] = useState(false);

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

  // 2. CAMBIO: Usamos las variables directas
  const description = lang === 'es' ? description_es : description_en;
  const imageUrl = getImageUrl(image_route);

  return (
    <>
    // Agregamos 'h-full flex flex-col' para que las tarjetas tengan la misma altura
    <div 
      className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full h-full flex flex-col transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 border border-white/10 cursor-pointer"
      onClick={() => setIsExpanded(true)}
    >
      
      <div className="relative w-full h-[230px]">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover rounded-2xl"
          loading="lazy"
        />
        
        {/* Overlay de enlaces */}
        <div className="absolute inset-0 flex justify-end m-3 opacity-0 hover:opacity-100 transition-opacity duration-300">
          {repo_url && (
            <a
              href={repo_url}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black/70 w-10 h-10 rounded-full flex justify-center items-center cursor-pointer mr-2 backdrop-blur-sm hover:bg-[#915eff] transition-colors border border-white/20"
              title="GitHub Repo"
            >
              <img src={githubIcon.src} alt="github" className="w-1/2 h-1/2 object-contain" />
            </a>
          )}
          {project_url && (
             <a
               href={project_url}
               onClick={(e) => e.stopPropagation()}
               target="_blank"
               rel="noopener noreferrer"
               className="bg-black/70 w-10 h-10 rounded-full flex justify-center items-center cursor-pointer backdrop-blur-sm hover:bg-[#915eff] transition-colors border border-white/20"
               title="Live Demo"
             >
              <img src={linkIcon.src} alt="link" className="w-1/2 h-1/2 object-contain" />
            </a>
          )}
        </div>
      </div>

      <div className="mt-5 flex-1">
        <h3 className="text-white font-bold text-[24px] truncate" title={title}>{title}</h3>
        <p className="mt-2 text-secondary text-[14px] line-clamp-3">{description}</p>
      </div>

      {/* Tecnologías */}
      <div className="mt-4 flex flex-wrap gap-2">
        {technologies.map((tech, index) => (
          <div key={tech.id || index} className="flex items-center justify-center bg-black-200/50 p-2 rounded-full border border-white/5 w-8 h-8" title={tech.name}>
             {tech.icon && <img src={getImageUrl(tech.icon)} alt={tech.name} className="w-full h-full object-contain" />}
          </div>
        ))}
      </div>
      
      {/* Tags */}
      <div className='mt-3 flex flex-wrap gap-2'>
        {tags.map((tag, index) => (
          <p key={tag.id || index} className={`text-[14px] text-blue-400`}>
            #{tag.name}
          </p>
        ))}
      </div>
    </div>

    {/* Modal Expandido (Portal) */}
    {isExpanded && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setIsExpanded(false)}>
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.9 }}
             className="bg-[#151030] p-6 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative border border-white/10 shadow-2xl custom-scrollbar"
             onClick={(e) => e.stopPropagation()}
           >
              {/* Botón Cerrar */}
              <button onClick={() => setIsExpanded(false)} className="absolute top-4 right-4 text-secondary hover:text-white text-2xl z-10 transition-colors">✕</button>
              
              {/* Imagen Grande */}
              <div className="relative w-full h-[300px] rounded-xl overflow-hidden mb-6 bg-black/20">
                 <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
              </div>

              <h3 className="text-white font-bold text-[30px] mb-4">{title}</h3>
              
              {/* Descripción Completa */}
              <p className="text-secondary text-[16px] leading-relaxed mb-6 whitespace-pre-wrap">
                {description}
              </p>

              {/* Tecnologías con Nombre */}
              <div className="mb-6">
                 <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider opacity-80">Tecnologías</h4>
                 <div className="flex flex-wrap gap-2">
                    {technologies.map((tech, index) => (
                      <div key={tech.id || index} className="flex items-center gap-2 bg-black-200/50 px-3 py-1.5 rounded-lg border border-white/5">
                        {tech.icon && <img src={getImageUrl(tech.icon)} alt={tech.name} className="w-4 h-4 object-contain" />}
                        <p className="text-white text-[12px] uppercase tracking-wider">{tech.name}</p>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                 {repo_url && (
                   <a href={repo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full hover:bg-[#915eff] transition-all border border-white/20">
                     <img src={githubIcon.src} alt="github" className="w-5 h-5" /> 
                     <span className="font-bold text-sm">GitHub Repo</span>
                   </a>
                 )}
                 {project_url && (
                   <a href={project_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#915eff] text-white px-6 py-2.5 rounded-full hover:bg-[#7e4ee0] transition-all font-bold text-sm">
                     <img src={linkIcon.src} alt="demo" className="w-5 h-5" /> 
                     Live Demo
                   </a>
                 )}
              </div>
           </motion.div>
        </div>,
        document.body
    )}
    </>
  );
};

export default ProjectCard;