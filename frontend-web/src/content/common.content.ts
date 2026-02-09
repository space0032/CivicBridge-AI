import { t, type DeclarationContent } from "intlayer";

const commonContent = {
  key: "common",
  content: {
    welcome: t({
      en: "Welcome to CivicBridge AI",
      es: "Bienvenido a CivicBridge AI",
      hi: "CivicBridge AI में आपका स्वागत है",
    }),
    search: t({
      en: "Search for resources",
      es: "Buscar recursos",
      hi: "संसाधन खोजें",
    }),
    programs: t({
      en: "Programs",
      es: "Programas",
      hi: "कार्यक्रम",
    }),
    healthcare: t({
      en: "Healthcare",
      es: "Salud",
      hi: "स्वास्थ्य सेवा",
    }),
    education: t({
      en: "Education",
      es: "Educación",
      hi: "शिक्षा",
    }),
    employment: t({
      en: "Employment",
      es: "Empleo",
      hi: "रोजगार",
    }),
    voice_search: t({
      en: "Voice Search",
      es: "Búsqueda por voz",
      hi: "आवाज खोज",
    }),
    location: t({
      en: "Location",
      es: "Ubicación",
      hi: "स्थान",
    }),
    nearby: t({
      en: "Nearby",
      es: "Cercano",
      hi: "निकटवर्ती",
    }),
    filter: t({
      en: "Filter",
      es: "Filtrar",
      hi: "फ़िल्टर",
    }),
    apply: t({
      en: "Apply",
      es: "Aplicar",
      hi: "लागू करें",
    }),
    learn_more: t({
      en: "Learn More",
      es: "Saber más",
      hi: "और जानें",
    }),
    login: t({
      en: "Login",
      es: "Iniciar sesión",
      hi: "लॉगिन",
    }),
    register: t({
      en: "Register",
      es: "Registrarse",
      hi: "पंजीकरण करें",
    }),
    logout: t({
      en: "Logout",
      es: "Cerrar sesión",
      hi: "लॉग आउट",
    }),
  },
} satisfies DeclarationContent;

export default commonContent;
