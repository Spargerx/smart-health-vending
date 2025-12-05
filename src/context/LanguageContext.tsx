"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { getCookie, getProfileCookie, setProfileCookie } from "@/utils/cookieUtils";

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

        // 1. Try to get language from profile cookie (fastest)
        const profile = getProfileCookie();
        if (profile && profile.language) {
            setLanguageState(profile.language as Language);
            return;
        }

        // 2. Fallback: Load from session storage (legacy/backup)
        const storedLang = sessionStorage.getItem("appLanguage") as Language;
        if (storedLang) {
            setLanguageState(storedLang);
        }

        // 3. Fetch from DB if user is logged in (and update cookie)
        const uid = getCookie("studentId") || sessionStorage.getItem("studentId");
        if (uid) {
            try {
                const res = await fetch("/api/gateway", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        action: "get-student-profile",
                        payload: { uid }
                    })
                });
                const data = await res.json();
                if (data.success && data.language) {
                    setLanguageState(data.language as Language);
                    sessionStorage.setItem("appLanguage", data.language);

                    // Update profile cookie if it exists
                    if (profile) {
                        profile.language = data.language;
                        setProfileCookie(profile);
                    }
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
        const uid = getCookie("studentId") || sessionStorage.getItem("studentId");
        if (uid) {
            try {
                await fetch("/api/gateway", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        action: "update-language",
                        payload: { uid, language: newLang }
                    }),
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
