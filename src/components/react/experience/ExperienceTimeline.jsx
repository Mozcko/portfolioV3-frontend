import React, { useRef } from "react";
import Experience from "./Experience";

const ExperienceTimeline = ({ jobs = [] }) => {
  const containerRef = useRef(null);
  
  // 1. Ordenar trabajos: Más recientes primero (Descendente)
  // Convertimos "YYYY-MM" a timestamps para comparar
  const sortedJobs = [...jobs].sort((a, b) => {
    // Truco: Agregamos "-01" para que Date lo parsee correctamente
    const dateA = new Date(`${a.start_date}-01`).getTime();
    const dateB = new Date(`${b.start_date}-01`).getTime();
    return dateB - dateA; // B - A para descendente
  });

  return (
    <div className="w-full relative mt-20">
      
      {/* --- Línea Central Horizontal --- */}
      {/* Esta es la "cuerda" donde cuelgan las experiencias */}
      <div className="absolute top-[-34px] left-0 w-full h-[4px] bg-white/10 z-0 rounded-full"></div>

      {/* --- Contenedor con Scroll Horizontal --- */}
      <div 
        ref={containerRef}
        className="flex gap-8 overflow-x-auto pb-12 pt-2 px-4 md:px-10 hide-scrollbar cursor-grab active:cursor-grabbing"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Renderizamos las tarjetas */}
        {sortedJobs.map((job, index) => (
          <Experience key={job.id || index} job={job} index={index} />
        ))}
        
        {/* Tarjeta final de "Inicio / Start" */}
        <div className="relative flex-shrink-0 w-[100px] flex flex-col justify-start items-center opacity-50 pt-2">
             {/* Nodo final en la línea */}
            <div className="absolute top-[-42px] w-4 h-4 rounded-full bg-white/20"></div>
            <div className="absolute top-[-34px] left-1/2 -translate-x-1/2 w-[2px] h-10 bg-white/10"></div>
            <span className="text-sm text-secondary font-mono mt-8">Start_</span>
        </div>
      </div>
    </div>
  );
};

export default ExperienceTimeline;