import React from "react";
import { motion } from "framer-motion";

const Experience = ({ job, index }) => {
  // 1. Helper para formatear fechas "YYYY-MM" -> "Aug 2022"
  const formatDate = (dateString) => {
    if (!dateString) return "";
    // Agregamos "-01" para asegurar que sea una fecha válida para el constructor Date
    // y manejamos la zona horaria para evitar desfases de día
    const [year, month] = dateString.split('-');
    const date = new Date(year, month - 1); // Mes en JS es 0-indexado
    
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  // 2. Helper para la imagen (Misma lógica que en el admin)
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    
    // Obtenemos la URL base del .env
    const API_URL = (import.meta.env.PUBLIC_API_URL || '').replace(/\/$/, '');
    return `${API_URL}${path}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="relative flex-shrink-0 w-[320px] xs:w-[380px] p-2" // Un poco más ancho para que respire
    >
      {/* --- Elementos Decorativos de la Línea de Tiempo --- */}
      {/* Línea vertical superior que conecta con la línea horizontal principal */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-[2px] h-10 bg-white/20"></div>
      {/* Punto (Nodo) sobre la línea */}
      <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#915eff] border-4 border-[#1d1836] shadow-[0_0_10px_#915eff]"></div>

      {/* --- Tarjeta del Trabajo --- */}
      <div className="bg-[#1d1836] p-6 rounded-2xl border border-white/10 shadow-card hover:border-[#915eff]/50 transition-all duration-300 group h-full flex flex-col">
        
        {/* Header: Fechas y Badge "Current" */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-[#915eff] font-bold text-sm font-mono">
            {formatDate(job.start_date)} - {job.current_job ? "Present" : formatDate(job.end_date)}
          </span>
          {job.current_job && (
            <span className="bg-green-500/10 text-green-400 text-[10px] font-bold px-2 py-1 rounded-full border border-green-500/20 uppercase tracking-wider animate-pulse">
              Current
            </span>
          )}
        </div>

        {/* Cuerpo: Logo y Título */}
        <div className="flex items-center gap-4 mb-2">
            {/* Contenedor del Logo */}
            <div className="w-14 h-14 min-w-[56px] bg-white/10 rounded-xl flex justify-center items-center overflow-hidden border border-white/10 group-hover:scale-105 transition-transform duration-300 p-2 bg-white">
                {job.image_route ? (
                    <img 
                        src={getImageUrl(job.image_route)} 
                        alt={job.title} 
                        className="w-full h-full object-contain" 
                    />
                ) : (
                    <span className="text-2xl">💼</span>
                )}
            </div>

            {/* Título del Puesto */}
            <h3 className="text-white text-xl font-bold leading-tight group-hover:text-[#915eff] transition-colors">
                {job.title}
            </h3>
        </div>

        {/* (Espacio reservado por si en el futuro agregas descripción o empresa) */}
        {/* <p className="text-secondary text-sm mt-3 line-clamp-3">Descripción...</p> */}
      </div>
    </motion.div>
  );
};

export default Experience;