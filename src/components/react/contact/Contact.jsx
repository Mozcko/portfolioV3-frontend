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

  // Obtenemos las variables de entorno
  const SERVICE_ID = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validación básica
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      alert("Error de configuración: Faltan las credenciales de EmailJS en el archivo .env");
      setLoading(false);
      return;
    }

    emailjs
      .send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: "Mozcko", // Tu nombre o el que configures en el template
          from_email: form.email,
          to_email: "tu_email@ejemplo.com", // Opcional, depende de tu template
          message: form.message,
        },
        PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          alert(t["contact.form.success"] || "¡Mensaje enviado con éxito!");
          
          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false);
          console.error("FAILED...", error);
          alert(t["contact.form.error"] || "Hubo un error al enviar el mensaje.");
        }
      );
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

  const labelClasses = `
    absolute 
    left-6 
    transition-all 
    duration-300 
    transform 
    origin-[0] 
    pointer-events-none
    
    /* Estado: Input Vacío -> Label abajo */
    peer-placeholder-shown:top-4 
    peer-placeholder-shown:scale-100 
    peer-placeholder-shown:text-secondary 
    
    /* Estado: Foco o Texto -> Label arriba */
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
              placeholder="Nombre"
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
              className={`${inputClasses} resize-none`}
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