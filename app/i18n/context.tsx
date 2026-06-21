"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Lang = "en" | "ar";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; ready: boolean }>({
  lang: "ar",
  setLang: () => {},
  ready: false,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");
  const [ready, setReady] = useState(false);

  // Read saved language once on mount — before first paint shows translated content
  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    const resolved = saved === "ar" || saved === "en" ? saved : "ar";
    setLangState(resolved);
    document.documentElement.lang = resolved;
    document.documentElement.dir = resolved === "ar" ? "rtl" : "ltr";
    setReady(true);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  };

  return (
    <LangContext.Provider value={{ lang, setLang, ready }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
