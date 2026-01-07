import React from 'react';
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
    // Agregamos 'h-full flex flex-col' para que las tarjetas tengan la misma altura
    <div className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full h-full flex flex-col transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 border border-white/10">
      
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
          <div key={tech.id || index} className="flex items-center gap-1.5 bg-black-200/50 px-2 py-1 rounded-md border border-white/5">
             {tech.icon && <img src={getImageUrl(tech.icon)} alt={tech.name} className="w-3 h-3 object-contain" />}
             <p className="text-white text-[10px] uppercase tracking-wider">{tech.name}</p>
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
  );
};

export default ProjectCard;