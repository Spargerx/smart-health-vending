"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getUserCookie } from "@/utils/cookies";

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
    FileText,
    AlertTriangle,
    Mail,
    Send,
} from "lucide-react";

export default function HindiHome() {
    const router = useRouter();

    const [isNavigating, setIsNavigating] = useState(false);
    const [isLanguageSwitching, setIsLanguageSwitching] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [showTerms, setShowTerms] = useState(false);
    const [showSafety, setShowSafety] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
    const [isSubmittingContact, setIsSubmittingContact] = useState(false);
    const [contactSubmitted, setContactSubmitted] = useState(false);
    const [contactError, setContactError] = useState("");

    const essentials = [
        "मेडिकल-ग्रेड बैंडेज और स्टेराइल कॉटन",
        "एंटीसेप्टिक वाइप्स, जैल और स्प्रे",
        "पुन: उपयोग योग्य कोल्ड पैक और त्वचा-सुरक्षित टेप",
    ];

    const previewSteps = [
        {
            id: 1,
            title: "अपनी पहचान सत्यापित करें",
            description: "शुरू करने के लिए अपने स्टूडेंट आईडी कार्ड के बारकोड को स्कैन करें।",
            icon: Fingerprint,
            details: "तेज़ और सुरक्षित पहुंच के लिए अपने आईडी कार्ड का उपयोग करें।",
        },
        {
            id: 2,
            title: "AI स्वास्थ्य विश्लेषण",
            description: "अपनी समस्या बताएं या चोट की फोटो लें।",
            icon: Bot,
            details: "हमारा AI लक्षणों का विश्लेषण करके सही सलाह देगा।",
        },
        {
            id: 3,
            title: "सिफारिशें देखें",
            description: "तुरंत प्राथमिक उपचार के सुझाव और उत्पाद प्राप्त करें।",
            icon: Stethoscope,
            details: "विशेषज्ञों द्वारा सत्यापित प्राथमिक उपचार सलाह।",
        },
        {
            id: 4,
            title: "उत्पाद चुनें",
            description: "सुझाए गए उत्पाद या अन्य आवश्यक वस्तुएं चुनें।",
            icon: Camera,
            details: "आसानी से कार्ट में जोड़ें और चेकआउट करें।",
        },
        {
            id: 5,
            title: "रसीद प्राप्त करें",
            description: "अपना सामान लें और डिजिटल रसीद प्राप्त करें।",
            icon: HeartPulse,
            details: "भविष्य के संदर्भ के लिए रसीद सुरक्षित रखें।",
        },
    ];

    const handleGetStarted = () => {
        if (isNavigating) return;
        setIsNavigating(true);

        // Check if user is already authenticated via cookie
        const userProfile = getUserCookie();
        if (userProfile) {
            // User is authenticated, go directly to dashboard
            setTimeout(() => router.push("/hi/dashboard"), 350);
        } else {
            // User needs to authenticate
            setTimeout(() => router.push("/hi/auth"), 350);
        }
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
                            alt="CureGenie लोगो"
                            className="h-12 w-12 rounded-full bg-white/5 p-1"
                            priority
                        />
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-300">क्योरजेनी (CureGenie)</p>
                            <p className="text-xs text-slate-400">स्मार्ट हेल्थ असिस्टेंस</p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            console.log("English button clicked");
                            setIsLanguageSwitching(true);
                            setTimeout(() => {
                                window.location.href = "/en";
                            }, 350);
                        }}
                        disabled={isLanguageSwitching}
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Globe className="h-4 w-4" />
                        <span>English</span>
                    </button>
                </header>

                <div className={`mt-12 space-y-8 transition-all duration-500 ${isNavigating || isLanguageSwitching ? "translate-y-4 opacity-50" : "opacity-100"}`}>
                    <div className="space-y-6 lg:max-w-4xl">
                        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
                            क्योरजेनी में आपका स्वागत है
                        </h1>
                        <h2 className="max-w-2xl text-2xl font-semibold text-slate-200 sm:text-2xl mb-4">
                            स्मार्ट हेल्थ असिस्टेंस वेंडिंग मशीन
                        </h2>
                        <p className="max-w-3xl text-lg font-light text-slate-300 sm:text-lg">
                            क्योरजेनी इंटेलिजेंट ट्राइएज, रिमोट चिकित्सकों और तुरंत उपलब्ध आवश्यक मेडिकल वस्तुओं को एक साथ लाता है — ताकि आप कुछ ही सेकंड में सही कदम उठा सकें।
                        </p>
                    </div>

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
                        <div className="flex flex-wrap items-center gap-4">
                            <motion.button
                                onClick={handleGetStarted}
                                disabled={isNavigating}
                                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 px-8 py-3 text-base font-semibold shadow-lg shadow-sky-500/40 transition hover:shadow-sky-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                whileHover={!isNavigating ? { scale: 1.04 } : {}}
                                whileTap={!isNavigating ? { scale: 0.98 } : {}}
                                aria-label="CureGenie के साथ शुरू करें"
                            >
                                शुरू करें
                            </motion.button>
                            <motion.button
                                onClick={() => setShowPreview(true)}
                                className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-8 py-3 text-base font-semibold text-slate-100 transition hover:border-cyan-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                aria-label="CureGenie का प्रीव्यू देखें"
                            >
                                प्रीव्यू देखें
                            </motion.button>
                        </div>
                    </div>
                    <p className="text-base text-slate-400">
                        शुरू करने के लिए "शुरू करें" पर टैप करें।<br />
                        चिकित्सक द्वारा समीक्षित सलाह के लिए मार्गदर्शन शुल्क ₹10 है।
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
                        <h2 className="text-sm uppercase tracking-[0.35em] text-cyan-200">आपकी सुरक्षा के लिए निर्मित</h2>
                        <div className="mt-4 space-y-3">
                            <p className="text-base text-slate-100">
                                यह मशीन केवल प्राथमिक उपचार के लिए है।
                            </p>
                            <p className="text-sm text-slate-300">
                                गंभीर या आपातकालीन मामलों में, उपयोगकर्ता को तुरंत पास के डॉक्टर या अस्पताल के लिए निर्देशित किया जाता है।
                            </p>
                            <p className="text-sm text-slate-300">
                                हर अनुशंसा की समीक्षा रिमोट मेडिकल विशेषज्ञों द्वारा की जाती है।
                            </p>
                            <p className="text-sm text-slate-300">
                                उच्च कंट्रास्ट डिज़ाइन और बड़े टैप बटन सभी उपयोगकर्ताओं के लिए अनुभव को सरल और सुलभ बनाते हैं।
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-slate-900/30"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                    >
                        <h2 className="text-sm uppercase tracking-[0.35em] text-cyan-200">प्राथमिक उपचार आवश्यक वस्तुओं का केंद्र</h2>
                        <p className="mt-4 text-lg text-slate-100">
                            बिना प्रिस्क्रिप्शन, बिना इंतज़ार —<br />
                            प्राथमिक उपचार की वस्तुएं तुरंत खरीदें।
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
                        <button onClick={() => setShowTerms(true)} className="transition hover:text-white">
                            नियम और गोपनीयता
                        </button>
                        <button onClick={() => setShowSafety(true)} className="transition hover:text-white">
                            सुरक्षा संबंधी जानकारी
                        </button>
                        <button onClick={() => setShowContact(true)} className="transition hover:text-white">
                            सहायता से संपर्क करें
                        </button>
                    </nav>
                    <div className="text-xs text-slate-500">
                        <p className="mb-2">⚠️ महत्वपूर्ण सूचना:</p>
                        <p>इस मशीन का उपयोग आपातकालीन सेवाओं के विकल्प के रूप में न करें।</p>
                        <p>यदि स्थिति जीवन के लिए खतरा हो, तो तुरंत अपने स्थानीय आपातकालीन नंबर पर कॉल करें।</p>
                    </div>
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
                                    <h2 className="text-2xl font-semibold text-white">CureGenie कैसे काम करता है</h2>
                                    <p className="mt-1 text-sm text-slate-400">
                                        5 आसान चरणों में स्वास्थ्य सहायता प्राप्त करें
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
                                    <span>चरण {currentStep + 1} / {previewSteps.length}</span>
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
                                                    चरण {previewSteps[currentStep].id}
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
                                    पीछे
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
                                        आगे
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
                                        समझ गया
                                    </motion.button>
                                )}
                            </div>

                            {/* Footer Note */}
                            <div className="mt-6 border-t border-white/10 pt-4">
                                <p className="text-center text-xs text-slate-400">
                                    <ShieldCheck className="mr-1 inline h-3 w-3" />
                                    आपका डेटा हमारे पास सुरक्षित है। हम इसे कभी साझा नहीं करते।
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            {/* Terms & Privacy Modal - Hindi */}
            <AnimatePresence>
                {showTerms && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowTerms(false)}
                        />
                        <motion.div
                            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl max-h-[80vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/20 bg-slate-900 p-6 shadow-2xl sm:p-8"
                            initial={{ opacity: 0, scale: 0.9, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-8 w-8 text-cyan-400" />
                                    <h2 className="text-2xl font-semibold text-white">नियम और गोपनीयता नीति</h2>
                                </div>
                                <button
                                    onClick={() => setShowTerms(false)}
                                    className="rounded-full bg-white/10 p-2 text-slate-400 transition hover:bg-white/20 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-6 text-slate-300">
                                <section>
                                    <h3 className="mb-3 text-lg font-semibold text-white">गोपनीयता पहले</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex gap-2">
                                            <span className="text-cyan-400">•</span>
                                            <span>हम आपकी फोटो स्टोर नहीं करते। इसका विश्लेषण एक बार किया जाता है और तुरंत हटा दिया जाता है।</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-cyan-400">•</span>
                                            <span>ऑडिट सुरक्षा के लिए केवल मास्क्ड आइडेंटिटी लॉग रखे जाते हैं।</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-cyan-400">•</span>
                                            <span>कोई व्यक्तिगत चिकित्सा रिकॉर्ड संग्रहीत नहीं किया जाता है।</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-cyan-400">•</span>
                                            <span>आपका स्टूडेंट टोकन सुरक्षित और एन्क्रिप्टेड है।</span>
                                        </li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="mb-3 text-lg font-semibold text-white">उपयोग की शर्तें</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex gap-2">
                                            <span className="text-cyan-400">•</span>
                                            <span>यह मशीन केवल बुनियादी प्राथमिक चिकित्सा मार्गदर्शन प्रदान करती है।</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-cyan-400">•</span>
                                            <span>आपात स्थिति के लिए, हमेशा 112 पर कॉल करें या अस्पताल जाएं।</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-cyan-400">•</span>
                                            <span>AI सिफारिशों की चिकित्सा पेशेवरों द्वारा समीक्षा की जाती है।</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-cyan-400">•</span>
                                            <span>इस सेवा का उपयोग करने के लिए आपको पंजीकृत छात्र होना चाहिए।</span>
                                        </li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="mb-3 text-lg font-semibold text-white">डेटा उपयोग</h3>
                                    <p className="text-sm">
                                        हम न्यूनतम डेटा एकत्र करते हैं: स्टूडेंट आईडी (मास्क्ड), टाइमस्टैम्प, और खरीदी गई वस्तुएं। यह डेटा हमें सेवा की गुणवत्ता में सुधार करने और इन्वेंट्री बनाए रखने में मदद करता है। हम कभी भी आपका डेटा तीसरे पक्ष के साथ साझा नहीं करते हैं।
                                    </p>
                                </section>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <motion.button
                                    onClick={() => setShowTerms(false)}
                                    className="rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    समझ गया
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Safety Info Modal - Hindi */}
            <AnimatePresence>
                {showSafety && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSafety(false)}
                        />
                        <motion.div
                            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl max-h-[80vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/20 bg-slate-900 p-6 shadow-2xl sm:p-8"
                            initial={{ opacity: 0, scale: 0.9, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="h-8 w-8 text-amber-400" />
                                    <h2 className="text-2xl font-semibold text-white">सुरक्षा जानकारी</h2>
                                </div>
                                <button
                                    onClick={() => setShowSafety(false)}
                                    className="rounded-full bg-white/10 p-2 text-slate-400 transition hover:bg-white/20 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-6 text-slate-300">
                                <div className="rounded-xl border-2 border-red-500/30 bg-red-500/10 p-4">
                                    <h3 className="mb-2 font-semibold text-red-300">⚠️ आपातकालीन स्थितियां</h3>
                                    <p className="text-sm text-red-200">
                                        यदि आप गंभीर रक्तस्राव, सांस लेने में कठिनाई, सीने में दर्द, चेतना की हानि, या किसी भी जीवन-धमकी की स्थिति का अनुभव करते हैं, तो <strong>तुरंत 112 पर कॉल करें</strong> या निकटतम अस्पताल जाएं। आपात स्थिति के लिए इस मशीन पर निर्भर न रहें।
                                    </p>
                                </div>

                                <section>
                                    <h3 className="mb-3 text-lg font-semibold text-white">इस मशीन का उपयोग कब करें</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex gap-2">
                                            <span className="text-green-400">✓</span>
                                            <span>छोटे कट और खरोंच</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-green-400">✓</span>
                                            <span>छोटी जलन (प्रथम-डिग्री)</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-green-400">✓</span>
                                            <span>सिरदर्द और हल्का दर्द</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-green-400">✓</span>
                                            <span>बुनियादी प्राथमिक चिकित्सा आपूर्ति</span>
                                        </li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="mb-3 text-lg font-semibold text-white">कब उपयोग न करें</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex gap-2">
                                            <span className="text-red-400">✗</span>
                                            <span>गंभीर रक्तस्राव या गहरे घाव</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-red-400">✗</span>
                                            <span>टूटी हड्डियां या फ्रैक्चर</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-red-400">✗</span>
                                            <span>सीने में दर्द या सांस लेने में कठिनाई</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-red-400">✗</span>
                                            <span>एलर्जी प्रतिक्रियाएं (गंभीर)</span>
                                        </li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="mb-3 text-lg font-semibold text-white">महत्वपूर्ण अनुस्मारक</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex gap-2">
                                            <span className="text-cyan-400">•</span>
                                            <span>उपयोग से पहले हमेशा उत्पाद लेबल पढ़ें</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-cyan-400">•</span>
                                            <span>सभी वस्तुओं पर समाप्ति तिथियां जांचें</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-cyan-400">•</span>
                                            <span>खुराक निर्देशों का सावधानीपूर्वक पालन करें</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-cyan-400">•</span>
                                            <span>यदि लक्षण बने रहते हैं तो डॉक्टर से परामर्श लें</span>
                                        </li>
                                    </ul>
                                </section>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <motion.button
                                    onClick={() => setShowSafety(false)}
                                    className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 font-semibold text-white shadow-lg"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    समझ गया
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Contact Support Modal - Hindi */}
            <AnimatePresence>
                {showContact && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowContact(false)}
                        />
                        <motion.div
                            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl max-h-[80vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/20 bg-slate-900 p-6 shadow-2xl sm:p-8"
                            initial={{ opacity: 0, scale: 0.9, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-8 w-8 text-emerald-400" />
                                    <h2 className="text-2xl font-semibold text-white">सहायता से संपर्क करें</h2>
                                </div>
                                <button
                                    onClick={() => setShowContact(false)}
                                    className="rounded-full bg-white/10 p-2 text-slate-400 transition hover:bg-white/20 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                                    <h3 className="mb-4 text-lg font-semibold text-white">संपर्क में रहें</h3>
                                    <div className="space-y-3 text-sm text-slate-300">
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-5 w-5 text-cyan-400" />
                                            <a href="mailto:support@curegenie.com" className="hover:text-cyan-300 transition">
                                                support@curegenie.com
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Globe className="h-5 w-5 text-cyan-400" />
                                            <a href="https://curegenie.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition">
                                                www.curegenie.com
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                                    <h3 className="mb-4 text-lg font-semibold text-white">फीडबैक भेजें</h3>
                                    {contactSubmitted ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                                                <CheckCircle2 className="h-8 w-8" />
                                            </div>
                                            <h4 className="mb-2 text-xl font-semibold text-white">संदेश भेजा गया!</h4>
                                            <p className="mb-6 text-slate-300">
                                                आपकी प्रतिक्रिया के लिए धन्यवाद। हम जल्द ही आपसे संपर्क करेंगे।
                                            </p>
                                            <motion.button
                                                onClick={() => {
                                                    setShowContact(false);
                                                    setContactSubmitted(false);
                                                    setContactForm({ name: "", email: "", message: "" });
                                                }}
                                                className="rounded-full bg-white/10 px-6 py-2 font-medium text-white transition hover:bg-white/20"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                बंद करें
                                            </motion.button>
                                        </div>
                                    ) : (
                                        <form className="space-y-4" onSubmit={async (e) => {
                                            e.preventDefault();
                                            setIsSubmittingContact(true);
                                            setContactError("");
                                            try {
                                                // Simulate network delay
                                                await new Promise(resolve => setTimeout(resolve, 1500));

                                                // Mock success
                                                setContactSubmitted(true);
                                            } catch (err) {
                                                console.error("Contact form error:", err);
                                                setContactError("संदेश भेजने में विफल। कृपया पुन: प्रयास करें।");
                                            } finally {
                                                setIsSubmittingContact(false);
                                            }
                                        }}>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-300">नाम</label>
                                                <input
                                                    type="text"
                                                    value={contactForm.name}
                                                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                                    className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                                                    placeholder="आपका नाम"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-300">ईमेल</label>
                                                <input
                                                    type="email"
                                                    value={contactForm.email}
                                                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                                    className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                                                    placeholder="your.email@example.com"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-300">संदेश</label>
                                                <textarea
                                                    value={contactForm.message}
                                                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                                    className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                                                    placeholder="हम आपकी कैसे मदद कर सकते हैं?"
                                                    rows={4}
                                                    required
                                                />
                                            </div>
                                            {contactError && (
                                                <div className="text-red-400 text-sm flex items-center gap-2">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    {contactError}
                                                </div>
                                            )}
                                            <motion.button
                                                type="submit"
                                                disabled={isSubmittingContact}
                                                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 px-6 py-3 font-semibold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                whileHover={!isSubmittingContact ? { scale: 1.02 } : {}}
                                                whileTap={!isSubmittingContact ? { scale: 0.98 } : {}}
                                            >
                                                <Send className="h-4 w-4" />
                                                {isSubmittingContact ? "भेजा जा रहा है..." : "संदेश भेजें"}
                                            </motion.button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>


        </section>
    );
}
