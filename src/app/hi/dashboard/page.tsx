"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
    Stethoscope,
    ShoppingCart,
    Receipt,
    Settings,
    ArrowRight,
    Bandage,
    Pill,
    Shield,
    AlertCircle,
    Sparkles,
} from "lucide-react";

const quickBuyItems = [
    { name: "बैंडेज", icon: Bandage },
    { name: "कॉटन", icon: Bandage },
    { name: "एंटीसेप्टिक", icon: Pill },
    { name: "पेन रिलीफ", icon: Pill },
];

export default function HindiDashboardPage() {
    const prefersReducedMotion = useReducedMotion();
    const [studentName, setStudentName] = useState("छात्र");
    const [isLoadingName, setIsLoadingName] = useState(true);
    const [nameError, setNameError] = useState("");

    const dashboardSections = [
        {
            title: "हेल्थ एनालिसिस",
            description: "AI द्वारा लक्षणों का विश्लेषण और प्राथमिक उपचार की सिफारिशें।",
            icon: Stethoscope,
            buttonText: "विश्लेषण शुरू करें",
            href: "/hi/health-analysis",
            accent: "from-cyan-400/80 to-blue-500/60",
            gradient: "from-cyan-500/20 to-blue-500/20",
        },
        {
            title: "क्विक बाय",
            description: "बिना विश्लेषण के सीधे फर्स्ट-एड उत्पाद खरीदें।",
            icon: ShoppingCart,
            buttonText: "अभी खरीदें",
            href: "/hi/quick-buy",
            accent: "from-emerald-400/80 to-teal-500/60",
            gradient: "from-emerald-500/20 to-teal-500/20",
        },
        {
            title: "इतिहास",
            description: "अपनी पिछली गतिविधियाँ और रसीदें देखें।",
            icon: Receipt,
            buttonText: "इतिहास देखें",
            href: "/hi/history",
            accent: "from-amber-400/80 to-orange-500/60",
            gradient: "from-amber-500/20 to-orange-500/20",
        },
        {
            title: "सेटिंग्स",
            description: "प्रोफ़ाइल, भाषा और मशीन सेटिंग्स बदलें।",
            icon: Settings,
            buttonText: "सेटिंग्स खोलें",
            href: "/hi/settings",
            accent: "from-purple-400/80 to-indigo-500/60",
            gradient: "from-purple-500/20 to-indigo-500/20",
        },
    ];

    useEffect(() => {
        if (typeof window === "undefined") return;

        const storedName = sessionStorage.getItem("studentFirstName");
        if (storedName) {
            setStudentName(storedName);
        } else {
            // Fallback for demo if not set
            const fullProfile = sessionStorage.getItem("studentProfile");
            if (fullProfile) {
                try {
                    const parsed = JSON.parse(fullProfile);
                    setStudentName(parsed.name || "छात्र");
                } catch (e) {
                    setStudentName("छात्र");
                }
            } else {
                setStudentName("छात्र");
            }
        }
        setIsLoadingName(false);
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
            <div className="orbital-gradient" aria-hidden />
            <div className="grid-overlay" aria-hidden />

            <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.header
                    className="mb-8"
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }}
                >
                    <motion.div
                        className="mb-6 flex items-center gap-3"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-white">
                                स्वागत है, {isLoadingName ? "..." : studentName}!
                            </h1>
                            <p className="text-sm text-slate-400">सफलतापूर्वक साइन इन किया गया</p>
                            {nameError && (
                                <p className="text-xs text-amber-400">{nameError}</p>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-6 backdrop-blur"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <p className="text-lg text-slate-100">
                            CureGenie आपकी सहायता के लिए तैयार है।
                        </p>
                        <p className="mt-2 text-sm text-slate-300">
                            शुरू करने के लिए नीचे दिए गए विकल्पों में से चुनें।
                        </p>
                    </motion.div>
                </motion.header>

                {/* Main Sections */}
                <div className="space-y-6">
                    {dashboardSections.map((section, index) => (
                        <motion.div
                            key={section.title}
                            className="frosted-card rounded-3xl border border-white/10 p-6 sm:p-8 transition hover:border-cyan-300/50"
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
                            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, delay: 0.3 + index * 0.1 }}
                            whileHover={prefersReducedMotion ? {} : { y: -4 }}
                        >
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                                {/* Icon */}
                                <div
                                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${section.accent} shadow-lg`}
                                >
                                    <section.icon className="h-8 w-8 text-white" />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h2 className="mb-2 text-2xl font-semibold text-white">
                                        {section.title}
                                    </h2>
                                    <p className="text-slate-300">{section.description}</p>

                                    {/* Quick Buy Items List */}
                                    {section.title === "क्विक बाय" && (
                                        <div className="mt-4 flex flex-wrap gap-3">
                                            {quickBuyItems.map((item) => {
                                                const Icon = item.icon;
                                                return (
                                                    <motion.div
                                                        key={item.name}
                                                        className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-slate-300"
                                                        whileHover={{ scale: 1.05, borderColor: "rgba(103,232,249,0.5)" }}
                                                    >
                                                        <Icon className="h-4 w-4 text-cyan-400" />
                                                        <span>{item.name}</span>
                                                    </motion.div>
                                                );
                                            })}
                                            <motion.div
                                                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-slate-300"
                                                whileHover={{ scale: 1.05, borderColor: "rgba(103,232,249,0.5)" }}
                                            >
                                                <span>+ और भी</span>
                                            </motion.div>
                                        </div>
                                    )}
                                </div>

                                {/* Button */}
                                <Link href={section.href}>
                                    <motion.button
                                        className={`group flex items-center gap-2 rounded-full bg-gradient-to-r ${section.accent} px-6 py-3 font-semibold text-white shadow-lg transition`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span>{section.buttonText}</span>
                                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Notes */}
                <motion.footer
                    className="mt-12 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                >
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 shrink-0 text-amber-400" />
                        <div className="space-y-2">
                            <p>
                                आपातकालीन स्थिति में, कृपया तुरंत 112 डायल करें या नजदीकी अस्पताल जाएं।
                            </p>
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-cyan-400" />
                                <p>
                                    आपका स्वास्थ्य डेटा एन्क्रिप्टेड और सुरक्षित है।
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.footer>
            </div>
        </div>
    );
}
