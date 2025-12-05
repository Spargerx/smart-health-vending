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

        // Fetch from DB if user is logged in
        const uid = sessionStorage.getItem("studentId");
        if (uid) {
            try {
                const res = await fetch(`/api/student-profile?uid=${encodeURIComponent(uid)}`);
                const data = await res.json();
                if (data.success && data.language) {
                    setLanguageState(data.language as Language);
                    sessionStorage.setItem("appLanguage", data.language);
                }
            } catch (err) {
                console.error("Failed to fetch language preference", err);
            }
        }
    }, [forcedLanguage]);

    const setLanguage = useCallback(async (newLang: Language) => {
        setLanguageState(newLang);
        sessionStorage.setItem("appLanguage", newLang);

        // Update in backend if user is logged in
        const uid = sessionStorage.getItem("studentId");
        if (uid) {
            try {
                await fetch("/api/update-language", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ uid, language: newLang }),
                });
            } catch (err) {
                console.error("Failed to update language preference", err);
            }
        }
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
