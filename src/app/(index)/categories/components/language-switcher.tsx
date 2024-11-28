import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

type LanguageContext = {
  state: "en" | "fr";
  switchLanguage: () => void;
};

const LanguageContext = React.createContext<LanguageContext | null>(null);

function useLanguage() {
  const context = React.useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}

const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const cookieLanguage = React.useMemo(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("language") as "en" | "fr";
    }
    return "en";
  }, []);
  const [state, setState] = React.useState<"en" | "fr">(cookieLanguage);

  const switchLanguage = () => {
    window.localStorage.setItem("language", state === "en" ? "fr" : "en");
    setState((prev) => (prev === "en" ? "fr" : "en"));
  };

  return (
    <LanguageContext.Provider value={{ state, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

function LanguageSwitcher({ className }: { className?: string }) {
  const { state, switchLanguage } = useLanguage();

  return (
    <Button className={cn(className)} onClick={switchLanguage}>
      {state === "en" ? "Voir en français" : "View in English"}
    </Button>
  );
}

export { LanguageProvider, LanguageSwitcher, useLanguage };
