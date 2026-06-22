import React, { createContext, useContext, useMemo, useState } from "react";
import { en } from "./en";
import { pl } from "./pl";

const LanguageContext = createContext();

const translations = { en, pl };

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  const value = useMemo(() => {
    const t = (key) => {
      const translated = getNestedValue(translations[language], key);
      return translated ?? key;
    };

    return {
      language,
      setLanguage,
      t,
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}