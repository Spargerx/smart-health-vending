"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import {
    Bot,
    Camera,
    Fingerprint,
    HeartPulse,
    ShieldCheck,
    Stethoscope,
    X,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Globe,
} from "lucide-react";

export default function Home() {
    const router = useRouter();

    const [isNavigating, setIsNavigating] = useState(false);
    const [isLanguageSwitching, setIsLanguageSwitching] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const essentials = [
        "Medical-grade bandages and sterile cotton",
        "Antiseptic wipes, gels, and sprays",
        "Reusable cold packs and skin-safe tape",
    ];

    const previewSteps = [
        {
            id: 1,
            title: "Verify Yourself",
            description: "Scan your Student ID to verify your identity securely.",
            icon: Fingerprint,
            details: "Quick verification takes less than 3 seconds. Your identity is protected with masked tokens.",
        },
        {
            id: 2,
            title: "AI Health Analysis",
            description: "Upload a photo and describe your symptoms for safe first-aid guidance.",
            icon: Bot,
            details: "AI gives you step-by-step first-aid instructions tailored to your needs.",
        },
        {
            id: 3,
            title: "View Recommendations",
            description: "See AI-assisted first-aid suggestions, severity level, and recommended items.",
            icon: Stethoscope,
            details: "Get personalized guidance with confidence indicators and safety alerts for serious cases.",
        },
        {
            id: 4,
            title: "Buy Items Directly",
            description: "Purchase essential first-aid items like bandages, antiseptic, and more instantly.",
            icon: Camera,
            details: "No wait, no analysis needed. Quick buy options for instant access to essentials.",
        },
        {
            id: 5,
            title: "Receipt Generation",
            description: "Digital receipts are automatically sent to your registered email ID.",
            icon: HeartPulse,
            details: "Keep a record of your purchases and care instructions. Download or print anytime.",
        },
    ];

    const handleGetStarted = () => {
        if (isNavigating) return;
        setIsNavigating(true);
        setTimeout(() => router.push("/en/auth"), 350);
    };

    function nextStep() {
        if (currentStep < previewSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    }

    function prevStep() {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    }

    function closePreview() {
        setShowPreview(false);
        setCurrentStep(0);
    }

    return (
        <section
            className={`relative min-h-screen overflow-hidden bg-gradient-to-b from-[#050b17] via-[#050f1f] to-[#030815] text-white transition-all duration-500 ${isNavigating || isLanguageSwitching ? "opacity-0" : "opacity-100"
                }`}
        >
            <div className="orbital-gradient" aria-hidden />
            <div className="grid-overlay" aria-hidden />
            <Image
                src="/curegenie-logo.png"
                width={800}
                height={800}
                alt=""
                aria-hidden
                className="watermark-logo"
                priority
            />

            <div
                className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-10 sm:px-6 sm:py-14 md:px-10 md:py-20 lg:px-16 lg:py-24 xl:px-24 xl:py-28"
                style={{
                    paddingTop: "40px",
                    paddingBottom: "40px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                }}
            >
                <header className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Image
                            src="/curegenie-logo.png"
                            width={64}
                            height={64}
                            alt="CureGenie logo - leaf and stethoscope"
                            className="h-12 w-12 rounded-full bg-white/5 p-1"
                            priority
                        />
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-300">{"CureGenie"}</p>
                            <p className="text-xs text-slate-400">{"Smart Health Assistance"}</p>
                        </div>
                    </div>

                    <motion.button
                        onClick={() => {
                            setIsLanguageSwitching(true);
                            setTimeout(() => router.push("/hi"), 350);
                        }}
                        disabled={isLanguageSwitching}
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={!isLanguageSwitching ? { scale: 1.05 } : {}}
                        whileTap={!isLanguageSwitching ? { scale: 0.95 } : {}}
                    >
                        <Globe className="h-4 w-4" />
                        <span>हिंदी</span>
                    </motion.button>
                </header>

                <div className={`mt-12 space-y-8 transition-all duration-500 ${isNavigating || isLanguageSwitching ? "translate-y-4 opacity-50" : "opacity-100"}`}>
                    <div className="space-y-6 lg:max-w-4xl">
                        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
                            {"Welcome to CureGenie - The Smart Health Assistance Vending Machine"}
                        </h1>
                        <h2 className="max-w-2xl text-xl font-light text-slate-200 sm:text-xl">
                            {"CureGenie combines intelligent triage, remote physicians, and ready-to-buy essentials so you can act within seconds."}
                        </h2>
                    </div>

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
                        <div className="flex flex-wrap items-center gap-4">
                            <motion.button
                                onClick={handleGetStarted}
                                disabled={isNavigating}
                                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 px-8 py-3 text-base font-semibold shadow-lg shadow-sky-500/40 transition hover:shadow-sky-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                whileHover={!isNavigating ? { scale: 1.04 } : {}}
                                whileTap={!isNavigating ? { scale: 0.98 } : {}}
                                aria-label="Get started with CureGenie"
                            >
                                Get Started
                            </motion.button>
                            <motion.button
                                onClick={() => setShowPreview(true)}
                                className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-8 py-3 text-base font-semibold text-slate-100 transition hover:border-cyan-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                aria-label="Preview the CureGenie flow"
                            >
                                {"Preview the Flow"}
                            </motion.button>
                        </div>
                    </div>
                    <p className="text-l text-slate-400">
                        Tap &quot;Get Started&quot; to begin. Guidance fee ₹10 for physician-reviewed recommendations.
                    </p>
                </div>

                <div className="mt-12 grid gap-6 lg:grid-cols-2">
                    <motion.div
                        className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-slate-900/30"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-sm uppercase tracking-[0.35em] text-cyan-200">{"Built for Your Safety"}</h2>
                        <p className="mt-4 text-lg text-slate-100">
                            {"This machine offers basic first aid only. Serious cases are immediately referred to a nearby doctor or hospital."}
                        </p>
                        <p className="mt-3 text-sm text-slate-300">
                            {"Every recommendation is reviewed by remote medical experts. Premium contrast and large tap targets keep the experience accessible."}
                        </p>
                    </motion.div>

                    <motion.div
                        className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-slate-900/30"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                    >
                        <h2 className="text-sm uppercase tracking-[0.35em] text-cyan-200">{"First-Aid Essentials Hub"}</h2>
                        <p className="mt-4 text-lg text-slate-100">
                            {"Purchase individual first-aid items instantly - no prescription, no wait."}
                        </p>
                        <ul className="mt-4 space-y-2 text-slate-200">
                            {essentials.map((item) => (
                                <li key={item} className="flex gap-3 text-sm">
                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>

            <footer className="relative z-10 border-t border-white/10 bg-slate-950/70">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <nav className="flex flex-wrap gap-4">
                        <a href="#" className="transition hover:text-white">
                            {"Terms & Privacy"}
                        </a>
                        <a href="#" className="transition hover:text-white">
                            {"Safety Info"}
                        </a>
                        <a href="#" className="transition hover:text-white">
                            {"Contact Support"}
                        </a>
                    </nav>
                    <p className="text-xs text-slate-500">
                        {"Do not use this machine in place of emergency services. For life-threatening situations, call your local emergency number immediately."}
                    </p>
                </div>
            </footer>

            {/* Preview Flow Modal */}
            <AnimatePresence>
                {showPreview && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closePreview}
                        />
                        <motion.div
                            className="fixed left-1/2 top-1/2 z-50 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/20 bg-slate-900 p-6 shadow-2xl sm:p-8"
                            initial={{ opacity: 0, scale: 0.9, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1, y: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-semibold text-white">{"Want to see how this machine works?"}</h2>
                                    <p className="mt-1 text-sm text-slate-400">
                                        {"Get a quick preview before you start"}
                                    </p>
                                </div>
                                <button
                                    onClick={closePreview}
                                    className="rounded-full bg-white/10 p-2 text-slate-400 transition hover:bg-white/20 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-6">
                                <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                                    <span>Step {currentStep + 1} of {previewSteps.length}</span>
                                    <span>{Math.round(((currentStep + 1) / previewSteps.length) * 100)}%</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${((currentStep + 1) / previewSteps.length) * 100}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </div>

                            {/* Step Content */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="mb-6"
                                >
                                    <div className="flex flex-col gap-6 sm:flex-row">
                                        {/* Icon */}
                                        <div className="flex shrink-0 items-center justify-center sm:w-32">
                                            <motion.div
                                                className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50"
                                                initial={{ scale: 0.8, rotate: -10 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ duration: 0.5, type: "spring" }}
                                            >
                                                {(() => {
                                                    const Icon = previewSteps[currentStep].icon;
                                                    return <Icon className="h-12 w-12 text-white" />;
                                                })()}
                                            </motion.div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="mb-2 flex items-center gap-2">
                                                <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-semibold text-cyan-300">
                                                    {"Step"} {previewSteps[currentStep].id}
                                                </span>
                                            </div>
                                            <h3 className="mb-3 text-2xl font-semibold text-white">
                                                {previewSteps[currentStep].title}
                                            </h3>
                                            <p className="mb-4 text-lg text-slate-300">
                                                {previewSteps[currentStep].description}
                                            </p>
                                            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4">
                                                <p className="text-sm text-cyan-200">
                                                    {previewSteps[currentStep].details}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation */}
                            <div className="flex items-center justify-between gap-4">
                                <motion.button
                                    onClick={prevStep}
                                    disabled={currentStep === 0}
                                    className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 font-medium text-slate-300 transition disabled:opacity-30 disabled:cursor-not-allowed hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
                                    whileHover={currentStep > 0 ? { scale: 1.05 } : {}}
                                    whileTap={currentStep > 0 ? { scale: 0.95 } : {}}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    {"Previous"}
                                </motion.button>
                                <div className="flex gap-2">
                                    {previewSteps.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentStep(index)}
                                            className={`h-2 rounded-full transition ${index === currentStep
                                                ? "w-8 bg-cyan-400"
                                                : "w-2 bg-white/20 hover:bg-white/40"
                                                }`}
                                        />
                                    ))}
                                </div>
                                {currentStep < previewSteps.length - 1 ? (
                                    <motion.button
                                        onClick={nextStep}
                                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {"Next"}
                                        <ChevronRight className="h-4 w-4" />
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        onClick={closePreview}
                                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 px-6 py-3 font-semibold text-white shadow-lg"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                        {"Got it!"}
                                    </motion.button>
                                )}
                            </div>

                            {/* Footer Note */}
                            <div className="mt-6 border-t border-white/10 pt-4">
                                <p className="text-center text-xs text-slate-400">
                                    <ShieldCheck className="mr-1 inline h-3 w-3" />
                                    {"Your data is never shared during preview. This is just a demonstration."}
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
