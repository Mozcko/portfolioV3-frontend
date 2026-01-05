import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser"; 

import { styles } from "../../../styles";
import TechGlobe from "../canvas/TechGlobe"; 

// Variantes de animación
const slideIn = (direction, type, delay, duration) => {
  return {
    hidden: {
      x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
      y: direction === "up" ? "100%" : direction === "down" ? "100%" : 0,
      opacity: 0,
    },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: type,
        delay: delay,
        duration: duration,
        ease: "easeOut",
      },
    },
  };
};

const Contact = ({ t = {}, lang }) => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // --- MOCK / LÓGICA DE ENVÍO ---
    setTimeout(() => {
        setLoading(false);
        alert(t["contact.form.success"] || "Message sent!");
        setForm({ name: "", email: "", message: "" });
    }, 2000);
  };

  // Clases CSS reutilizables para el efecto "Floating Label"
  const inputContainerClasses = "relative w-full group";
  
  const inputClasses = `
    peer 
    w-full 
    bg-tertiary 
    py-4 px-6 
    placeholder-transparent 
    text-white 
    rounded-lg 
    outline-none 
    border border-white/10 
    font-medium 
    transition-all 
    focus:border-[#915eff] 
    focus:ring-1 focus:ring-[#915eff]
  `;

  // Esta clase maneja la magia:
  // 1. Por defecto (o con texto): Está arriba (-top-7), pequeño (scale-75) y con color primario.
  // 2. peer-placeholder-shown: Si el input está vacío y sin foco, baja (top-4) y crece (scale-100).
  // 3. peer-focus: Si recibe foco, vuelve a subir inmediatamente.
  const labelClasses = `
    absolute 
    left-6 
    transition-all 
    duration-300 
    transform 
    origin-[0] 
    pointer-events-none
    
    /* Estado: Input Vacío (Placeholder visible) -> Label abajo (como placeholder) */
    peer-placeholder-shown:top-4 
    peer-placeholder-shown:scale-100 
    peer-placeholder-shown:text-secondary 
    
    /* Estado: Foco o Texto Escrito -> Label flotando arriba */
    peer-focus:-top-7 
    peer-focus:scale-75 
    peer-focus:text-[#915eff] 
    peer-focus:font-bold
    
    /* Posición por defecto (cuando hay texto) */
    -top-7 
    scale-75 
    text-[#915eff]
  `;

  return (
    <div className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}>
      
      {/* --- FORMULARIO --- */}
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className='flex-[0.75] bg-[#100d25] p-8 rounded-2xl border border-white/10 shadow-card relative z-10'
      >
        <p className={styles.sectionSubText}>{t["contact.subtitle"] || "Get in touch"}</p>
        <h3 className={styles.sectionHeadText}>{t["contact.title"] || "Contact."}</h3>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className='mt-12 flex flex-col gap-8'
        >
          {/* Nombre */}
          <div className={inputContainerClasses}>
            <input
              type='text'
              name='name'
              id='name'
              value={form.name}
              onChange={handleChange}
              placeholder="Nombre" // El texto aquí da igual, pero NO debe estar vacío para que funcione el selector CSS
              className={inputClasses}
              required
            />
            <label htmlFor='name' className={labelClasses}>
              {t["contact.form.name"] || "Your Name"}
            </label>
          </div>
          
          {/* Email */}
          <div className={inputContainerClasses}>
            <input
              type='email'
              name='email'
              id='email'
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className={inputClasses}
              required
            />
            <label htmlFor='email' className={labelClasses}>
              {t["contact.form.email"] || "Your Email"}
            </label>
          </div>
          
          {/* Mensaje */}
          <div className={inputContainerClasses}>
            <textarea
              rows={7}
              name='message'
              id='message'
              value={form.message}
              onChange={handleChange}
              placeholder="Mensaje"
              className={`${inputClasses} resize-none`} // Agregamos resize-none
              required
            />
            <label htmlFor='message' className={labelClasses}>
              {t["contact.form.message"] || "Your Message"}
            </label>
          </div>

          <button
            type='submit'
            className='bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary hover:bg-[#915eff] transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 hover:border-[#915eff]'
            disabled={loading}
          >
            {loading ? (t["contact.form.sending"] || "Sending...") : (t["contact.form.send"] || "Send")}
          </button>
        </form>
      </motion.div>

      {/* --- TECH GLOBE --- */}
      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className='xl:flex-1 xl:h-auto md:h-[550px] h-[350px] flex items-center justify-center'
      >
        <TechGlobe />
      </motion.div>
    </div>
  );
};

export default Contact;