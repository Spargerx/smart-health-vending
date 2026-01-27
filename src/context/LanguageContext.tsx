"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

type Language = "English" | "Hindi";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => Promise<void>;
    refreshLanguage: () => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
    children,
    forcedLanguage
}: {
    children: ReactNode;
    forcedLanguage?: Language
}) {
    const [language, setLanguageState] = useState<Language>(forcedLanguage || "English");

    const refreshLanguage = useCallback(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));

        // If language is forced (e.g. by route), don't overwrite it with DB/Session data
        if (forcedLanguage) return;

        // Load from session storage
        const storedLang = sessionStorage.getItem("appLanguage") as Language;
        if (storedLang) {
            setLanguageState(storedLang);
        }
    }, [forcedLanguage]);

    const setLanguage = useCallback(async (newLang: Language) => {
        setLanguageState(newLang);
        sessionStorage.setItem("appLanguage", newLang);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        refreshLanguage();
    }, [refreshLanguage]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, refreshLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within LanguageProvider");
    }
    return context;
}
