import React from 'react';
// 1. Importamos los iconos directamente como módulos
import githubIcon from '../../../assets/github.svg';
import linkIcon from '../../../assets/link.svg';

const ProjectCard = ({ project, lang = 'es' }) => {
  const API_URL = (import.meta.env.PUBLIC_API_URL || '/api').replace(/\/$/, '');

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    try {
      // This handles absolute API_URL (e.g., in production)
      const urlObj = new URL(API_URL);
      return `${urlObj.origin}${path}`;
    } catch (e) {
      // This handles relative API_URL (e.g., '/api' in local dev)
      return path;
    }
  };

  const description = lang === 'es' ? project.description_es : project.description_en;
  const imageUrl = getImageUrl(project.image_route);

  return (
    <div className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
      <div className="relative w-full h-[230px]">
        <img
          src={imageUrl}
          alt={project.title}
          className="w-full h-full object-cover rounded-2xl"
        />
        <div className="absolute inset-0 flex justify-end m-3 card-img_hover">
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black/50 w-10 h-10 rounded-full flex justify-center items-center cursor-pointer mr-2 backdrop-blur-sm transition-transform duration-200 hover:scale-110"
              title="Repositorio en GitHub"
            >
              <img src={githubIcon.src} alt="github" className="w-1/2 h-1/2 object-contain" />
            </a>
          )}
          {project.project_url && (
             <a
               href={project.project_url}
               target="_blank"
               rel="noopener noreferrer"
               className="bg-black/50 w-10 h-10 rounded-full flex justify-center items-center cursor-pointer backdrop-blur-sm transition-transform duration-200 hover:scale-110"
               title="Ver demo"
             >
              <img src={linkIcon.src} alt="live demo" className="w-1/2 h-1/2 object-contain" />
            </a>
          )}
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-white font-bold text-[24px] truncate">{project.title}</h3>
        <p className="mt-2 text-secondary text-[14px] line-clamp-3">{description}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <div key={tech.id} className="flex items-center gap-1.5 bg-black-200/50 px-2 py-1 rounded-md">
             {tech.icon && <img src={getImageUrl(tech.icon)} alt={tech.name} className="w-4 h-4 object-contain" />}
             <p className="text-white text-[12px]">{tech.name}</p>
          </div>
        ))}
      </div>
      
      <div className='mt-4 flex flex-wrap gap-2'>
        {project.tags.map((tag) => (
          <p key={tag.id} className={`text-[14px] text-blue-400`}>
            #{tag.name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ProjectCard;