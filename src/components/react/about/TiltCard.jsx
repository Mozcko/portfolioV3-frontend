import React from "react";
import { Tilt } from "react-tilt";

const TiltCard = ({ imageSrc }) => {
  const defaultOptions = {
    reverse: false,  // Invertir la dirección de inclinación
    max: 35,         // Rotación máxima en grados
    perspective: 1000, // Perspectiva de transformación
    scale: 1.1,      // Escala al hacer hover (1.1 = 110%)
    speed: 1000,     // Velocidad de transición
    transition: true, // Activar transición
    axis: null,      // Eje deshabilitado (null = ninguno)
    reset: true,     // Resetear al salir
    easing: "cubic-bezier(.03,.98,.52,.99)",
  };

  return (
    <Tilt options={defaultOptions} className="xs:w-[250px] w-full mx-auto">
      {/* 1. Fondo Gradiente (El borde brillante) */}
      <div className="w-full bg-gradient-to-r from-green-400 to-pink-600 p-[1px] rounded-[20px] shadow-card">
        
        {/* 2. Tarjeta Interior (Fondo oscuro) */}
        <div className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-center items-center flex-col">
          
          {/* Imagen de perfil */}
          <img
            src={imageSrc}
            alt="Profile"
            className="w-40 h-40 object-cover rounded-full border-4 border-white/10 shadow-lg"
          />
          
          <h3 className="text-white text-[20px] font-bold text-center mt-4">
            Mozcko
          </h3>
          <p className="text-secondary text-[14px] text-center">
            Full Stack Developer
          </p>
        </div>
      </div>
    </Tilt>
  );
};

export default TiltCard;