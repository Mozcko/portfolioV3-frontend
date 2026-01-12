import React from "react";
import { motion } from "framer-motion";

const CertificateCard = ({ index, title, school, link, image_route }) => {
  
  // Helper para la imagen (Igual que en tus otros componentes)
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const API_URL = (import.meta.env.PUBLIC_API_URL || '').replace(/\/$/, '');
    return `${API_URL}${path}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }} // Efecto cascada
      className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full h-full border border-white/10 hover:border-[#915eff]/50 transition-colors group relative flex flex-col"
    >
      {/* Contenedor de la Imagen */}
      <div className="relative w-full h-[200px] rounded-xl overflow-hidden mb-5 bg-black/20">
        <img
          src={getImageUrl(image_route)}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Overlay con Icono de Link al hacer Hover */}
        {link && (
          <div className="absolute inset-0 flex justify-end m-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-black/70 flex justify-center items-center hover:bg-[#915eff] transition-colors border border-white/20"
              title="Ver Certificado"
            >
              <span className="text-xl">🔗</span>
            </a>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-white font-bold text-[20px] leading-snug mb-2 min-h-[56px]">
          {title}
        </h3>
        <p className="text-secondary text-[14px] uppercase tracking-wider mb-4">
            {school}
        </p>
        
        {/* Botón secundario si no hicieron click en la imagen */}
        {link && (
          <div className="mt-auto pt-2">
              <a href={link} target="_blank" rel="noopener noreferrer" className="text-[#915eff] text-[14px] hover:text-white transition-colors flex items-center gap-2">
                  Ver Credencial <span>→</span>
              </a>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CertificateCard;