import React, { createContext, useContext } from 'react';
import { useIntlayerContext } from 'react-intlayer';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { locale, setLocale } = useIntlayerContext();

  const changeLanguage = (lang) => {
    setLocale(lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage: locale, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
