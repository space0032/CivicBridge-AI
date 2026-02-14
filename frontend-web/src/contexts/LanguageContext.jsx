import { createContext, useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      setCurrentLanguage(lng);
      setLoading(false);
    };
    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  const changeLanguage = (lang) => {
    if (i18n.language !== lang) {
      setLoading(true);
      i18n.changeLanguage(lang);
    }
  };

  const value = {
    currentLanguage,
    changeLanguage,
    loading
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
