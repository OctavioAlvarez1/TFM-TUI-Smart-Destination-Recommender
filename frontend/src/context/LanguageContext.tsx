import { createContext, useContext, useState, type ReactNode } from "react";
import { en } from "../locales/en";
import { es } from "../locales/es";
import type { Locale } from "../locales/en";

export type Lang = "en" | "es";

interface LanguageContextValue {
  lang: Lang;
  toggleLanguage: () => void;
  locale: Locale;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem("horizon_lang") as Lang) ?? "en";
  });

  const toggleLanguage = () => {
    setLang((prev) => {
      const next: Lang = prev === "en" ? "es" : "en";
      localStorage.setItem("horizon_lang", next);
      return next;
    });
  };

  const locale = lang === "en" ? en : es;

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, locale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
