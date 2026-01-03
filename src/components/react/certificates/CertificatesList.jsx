import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CertificateCard from "./CertificateCard";

const CertificatesList = ({ certificates = [], lang }) => {
  const [showAll, setShowAll] = useState(false);
  
  // Configuración: Cuántos mostrar inicialmente (3 es una fila en desktop)
  const INITIAL_COUNT = 3;
  
  // Si no hay botón "ver más", mostramos todo (caso < 3 certificados)
  const displayedCertificates = showAll ? certificates : certificates.slice(0, INITIAL_COUNT);
  
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
      {certificates.length > INITIAL_COUNT && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAll(!showAll)}
          className="bg-[#915eff] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2 text-sm uppercase tracking-wider"
        >
          {showAll ? (
            <>
              {lang === 'es' ? 'Mostrar Menos' : 'Show Less'} 
              <span className="text-lg">↑</span>
            </>
          ) : (
            <>
              {lang === 'es' ? `Ver todos (${certificates.length})` : `View all (${certificates.length})`}
              <span className="text-lg">↓</span>
            </>
          )}
        </motion.button>
      )}
    </div>
  );
};

export default CertificatesList;