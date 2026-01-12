import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CertificateCard from "./CertificateCard";

const CertificatesList = ({ certificates = [], lang, t = {} }) => {
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // 640px es el breakpoint 'sm' de Tailwind
    };

    handleResize(); // Check inicial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Configuración: 1 en móvil, 3 en desktop
  const initialCount = isMobile ? 1 : 3;
  
  // Si no hay botón "ver más", mostramos todo
  const displayedCertificates = showAll ? certificates : certificates.slice(0, initialCount);
  
  return (
    <div className="flex flex-col items-center">
      {/* Grid de Certificados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 w-full mb-10">
        <AnimatePresence>
          {displayedCertificates.map((cert, index) => (
            <CertificateCard 
              key={cert.id} 
              {...cert} 
              index={index} 
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Botón de Ver Más / Ver Menos */}
      {certificates.length > initialCount && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAll(!showAll)}
          className="bg-[#915eff] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2 text-sm uppercase tracking-wider"
        >
          {showAll ? (
            <>
              {/* USAMOS LA TRADUCCIÓN */}
              {t["general.show_less"] || "Show Less"} 
              <span className="text-lg">↑</span>
            </>
          ) : (
            <>
              {/* USAMOS LA TRADUCCIÓN */}
              {t["general.view_all"] || "View All"} ({certificates.length})
              <span className="text-lg">↓</span>
            </>
          )}
        </motion.button>
      )}
    </div>
  );
};

export default CertificatesList;