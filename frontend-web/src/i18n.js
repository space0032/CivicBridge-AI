import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to CivicBridge AI",
      "search": "Search for resources",
      "programs": "Programs",
      "healthcare": "Healthcare",
      "education": "Education",
      "employment": "Employment",
      "voice_search": "Voice Search",
      "location": "Location",
      "nearby": "Nearby",
      "filter": "Filter",
      "apply": "Apply",
      "learn_more": "Learn More",
      "login": "Login",
      "register": "Register",
      "logout": "Logout"
    }
  },
  es: {
    translation: {
      "welcome": "Bienvenido a CivicBridge AI",
      "search": "Buscar recursos",
      "programs": "Programas",
      "healthcare": "Salud",
      "education": "Educación",
      "employment": "Empleo",
      "voice_search": "Búsqueda por voz",
      "location": "Ubicación",
      "nearby": "Cercano",
      "filter": "Filtrar",
      "apply": "Aplicar",
      "learn_more": "Saber más",
      "login": "Iniciar sesión",
      "register": "Registrarse",
      "logout": "Cerrar sesión"
    }
  },
  hi: {
    translation: {
      "welcome": "CivicBridge AI में आपका स्वागत है",
      "search": "संसाधन खोजें",
      "programs": "कार्यक्रम",
      "healthcare": "स्वास्थ्य सेवा",
      "education": "शिक्षा",
      "employment": "रोजगार",
      "voice_search": "आवाज खोज",
      "location": "स्थान",
      "nearby": "निकटवर्ती",
      "filter": "फ़िल्टर",
      "apply": "लागू करें",
      "learn_more": "और जानें",
      "login": "लॉगिन",
      "register": "पंजीकरण करें",
      "logout": "लॉग आउट"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
