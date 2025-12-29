// Definimos los idiomas disponibles
export const languages = {
  es: 'Español',
  en: 'English',
};

export const defaultLang = 'es';

// Función para detectar el idioma desde la URL (útil para componentes)
export function getLangFromUrl(url) {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang;
  return defaultLang;
}

// Función para DESCARGAR las traducciones del Backend
export async function getTranslations(lang) {
  try {
    // Usamos tu URL de producción
    const url = `https://portfoliov3-backend-production.up.railway.app/i18n/${lang}`;
    const res = await fetch(url);
    
    if (!res.ok) {
      console.error(`Error fetching translations for ${lang}: ${res.status}`);
      return {}; // Retorna objeto vacío para no romper la app
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error de conexión con traducciones:", error);
    return {};
  }
}