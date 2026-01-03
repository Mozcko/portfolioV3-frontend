// Definimos los idiomas disponibles
export const languages = {
  es: 'Español',
  en: 'English',
};

export const defaultLang = 'es';

// Variable de Caché para no pedir lo mismo dos veces
const translationsCache = {};

export function getLangFromUrl(url) {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang;
  return defaultLang;
}

export async function getTranslations(lang) {
  // 1. Si ya tenemos los datos en memoria, los devolvemos inmediatamente (0ms)
  if (translationsCache[lang]) {
    return translationsCache[lang];
  }

  try {
    // 2. Obtenemos la URL del entorno (.env)
    // Usamos 'import.meta.env' que es el estándar de Astro/Vite
    const apiUrl = import.meta.env.PUBLIC_API_URL;

    if (!apiUrl) {
      console.warn("⚠️ PUBLIC_API_URL no está definida en el archivo .env");
    }

    // Aseguramos que la URL no tenga slash al final para evitar dobles //
    const cleanUrl = apiUrl ? apiUrl.replace(/\/$/, '') : '';
    const endpoint = `${cleanUrl}/i18n/${lang}`;

    console.log(`Descargando traducciones desde: ${endpoint}`); // Log útil para desarrollo

    const res = await fetch(endpoint);
    
    if (!res.ok) {
      console.error(`Error fetching translations for ${lang}: ${res.status}`);
      return {}; 
    }
    
    const data = await res.json();

    // 3. Guardamos en caché para el futuro
    translationsCache[lang] = data;
    
    return data;
  } catch (error) {
    console.error("Error de conexión con traducciones:", error);
    return {};
  }
}