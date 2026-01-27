"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Camera,
    Upload,
    X,
    AlertTriangle,
    Sparkles,
    Shield,
    ArrowLeft,
    Loader2,
    Stethoscope,
    Pill,
    ShoppingBag,
    Activity,
    FileText,
    CreditCard,
    Rocket,
} from "lucide-react";
import Link from "next/link";

interface AISuggestion {
    diagnosis: string;
    medication: string;
    prevention: string;
    vendingitems: string;
    raw?: string;
}

// Improved Rich Text Renderer for AI Output
const MarkdownRenderer = ({ content }: { content: string }) => {
    if (!content) return null;

    // Split by newlines but keep them for processing
    const lines = content.split('\n').filter(line => line.trim() !== '');

    return (
        <div className="space-y-2 text-slate-200">
            {lines.map((line, index) => {
                // Handle headers/bold lines (often starting with ** or just bold text)
                const isHeader = line.trim().startsWith('**') && line.trim().endsWith('**');

                // Handle list items
                const isOrderedList = /^\d+\./.test(line.trim());
                const isUnorderedList = /^-/.test(line.trim());

                // Parse bold text within the line: **text**
                const parts = line.split(/(\*\*.*?\*\*)/g);

                const renderedLine = parts.map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                });

                // Unordered List (- item): Show Dot, Remove Hyphen
                if (isUnorderedList) {
                    // Remove the leading hyphen and space from the first text part if it exists
                    const cleanRenderedLine = renderedLine.map((part, i) => {
                        if (i === 0 && typeof part === 'string') {
                            return part.replace(/^-+\s*/, '');
                        }
                        return part;
                    });

                    return (
                        <div key={index} className="flex gap-2 items-start pl-1">
                            <span className="text-cyan-400 mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                            <p className="flex-1 leading-relaxed text-slate-200">{cleanRenderedLine}</p>
                        </div>
                    );
                }

                // Ordered List (1. item): No Dot, Keep Number
                if (isOrderedList) {
                    return (
                        <div key={index} className="pl-1">
                            <p className="leading-relaxed text-slate-200">{renderedLine}</p>
                        </div>
                    );
                }

                return (
                    <p key={index} className={`leading-relaxed ${isHeader ? 'font-semibold text-white' : ''}`}>
                        {renderedLine}
                    </p>
                );
            })}
        </div>
    );
};
const exampleDescriptions = [
    "मेरे हाथ पर कट लग गया है और खून बह रहा है",
    "मेरी त्वचा पर लाल चकत्ते हो गए हैं",
    "मुझे तेज बुखार और सिरदर्द है",
    "मेरे टखने में मोच आ गई है",
];

export default function HindiHealthAnalysisPage() {
    const [userUid, setUserUid] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [description, setDescription] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [suggestions, setSuggestions] = useState<AISuggestion | null>(null);
    const [showUrgentAlert, setShowUrgentAlert] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [showCamera, setShowCamera] = useState(false);
    const [validationError, setValidationError] = useState<{ needsImage: boolean; needsDescription: boolean } | null>(null);
    const [showComingSoon, setShowComingSoon] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setUserUid(sessionStorage.getItem("studentId"));
        }
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((t) => t.stop());
                streamRef.current = null;
            }
        };
    }, []);

    function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    function handleCaptureClick() {
        setShowCamera(true);
        navigator.mediaDevices
            .getUserMedia({
                video: {
                    facingMode: "environment",
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            })
            .then((stream) => {
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
            })
            .catch((err) => {
                console.error("Camera error:", err);
                alert("कैमरा एक्सेस अस्वीकृत। कृपया अपलोड का उपयोग करें।");
                setShowCamera(false);
            });
    }

    function capturePhoto() {
        if (videoRef.current) {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0);
                const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
                setImage(dataUrl);
                setImagePreview(dataUrl);
                closeCamera();
            }
        }
    }

    function closeCamera() {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        setShowCamera(false);
    }

    function removeImage() {
        setImage(null);
        setImagePreview(null);
    }

    async function handleAnalyze() {
        const missingImage = !image;
        const missingDescription = description.length < 10;

        // Check if anything is missing
        if (missingImage || missingDescription) {
            setValidationError({
                needsImage: missingImage,
                needsDescription: missingDescription
            });
            return;
        }

        setIsAnalyzing(true);
        setSuggestions(null);
        setShowUrgentAlert(false);

        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 2500));

            // Mock Result
            const result = {
                diagnosis: "**नकली निदान**: विवरण/फोटो के आधार पर, यह एक छोटी चोट प्रतीत होती है।",
                medication: "**उपचार के चरण:**\n1. एंटीसेप्टिक वाइप्स से क्षेत्र को साफ करें।\n2. एंटीबायोटिक मलहम लगाएं।\n3. एक बाँझ पट्टी के साथ कवर करें।",
                prevention: "क्षेत्र को साफ और सूखा रखें। संक्रमण के संकेतों जैसे बढ़ी हुई लालिमा या सूजन के लिए देखें।",
                vendingitems: "पट्टियाँ, एंटीसेप्टिक वाइप्स",
                raw: "Raw mock data"
            };

            setSuggestions({
                diagnosis: result.diagnosis,
                medication: result.medication,
                prevention: result.prevention,
                vendingitems: result.vendingitems || "",
                raw: result.raw
            });

            // Simple urgency check based on keywords in diagnosis (checking both English and Hindi keywords just in case)
            const urgentKeywords = ["severe", "emergency", "doctor", "hospital", "immediate attention", "गंभीर", "डॉक्टर", "अस्पताल", "तुरंत"];
            const isUrgent = urgentKeywords.some(k => result.diagnosis?.toLowerCase().includes(k) || result.medication?.toLowerCase().includes(k));
            setShowUrgentAlert(isUrgent);

        } catch (error) {
            console.error("Analysis error:", error);
            alert("एक त्रुटि हुई। कृपया पुनः प्रयास करें।");
        } finally {
            setIsAnalyzing(false);
        }
    }

    function insertExample(exampleText: string) {
        setDescription(exampleText);
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
            <div className="orbital-gradient" aria-hidden />
            <div className="grid-overlay" aria-hidden />

            {/* Validation Error Modal */}
            <AnimatePresence>
                {validationError && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setValidationError(null)}
                    >
                        <motion.div
                            className="frosted-card max-w-lg w-full rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-slate-900/95 to-slate-800/95 p-8 shadow-2xl"
                            initial={{ scale: 0.8, y: 30, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.8, y: 30, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="mb-6 text-center">
                                <motion.div
                                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 ring-4 ring-amber-500/30"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.1, type: "spring", damping: 15 }}
                                >
                                    <AlertTriangle className="h-8 w-8 text-amber-400" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white">
                                    अधिक जानकारी चाहिए
                                </h3>
                                <p className="mt-2 text-sm text-slate-400">
                                    {validationError.needsImage && validationError.needsDescription
                                        ? "सटीक विश्लेषण के लिए कृपया फोटो और विवरण दोनों प्रदान करें।"
                                        : "सटीक विश्लेषण के लिए कृपया अधिक जानकारी प्रदान करें।"}
                                </p>
                            </div>

                            {/* Requirements Checklist */}
                            <div className="mb-6 space-y-3">
                                {validationError.needsImage && (
                                    <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                                            <Camera className="h-4 w-4 text-amber-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-white">फोटो आवश्यक है</div>
                                            <div className="mt-1 text-sm text-slate-300">
                                                चोट या लक्षण की स्पष्ट फोटो लें।
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {validationError.needsDescription && (
                                    <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                                            <Stethoscope className="h-4 w-4 text-amber-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-white">विवरण आवश्यक है</div>
                                            <div className="mt-1 text-sm text-slate-300">
                                                कृपया कम से कम 10 अक्षरों में समस्या का वर्णन करें।
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <motion.button
                                    onClick={() => setValidationError(null)}
                                    className="flex-1 rounded-full border-2 border-amber-500/30 bg-amber-500/10 px-6 py-3 font-semibold text-amber-300 transition hover:border-amber-500/50 hover:bg-amber-500/20"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    समझ गया
                                </motion.button>
                            </div>

                            {/* Helper Text */}
                            <p className="mt-4 text-center text-xs text-slate-500">
                                {validationError.needsImage && validationError.needsDescription
                                    ? "फोटो और विवरण दोनों जोड़ने से AI को बेहतर समझने में मदद मिलती है।"
                                    : "अधिक जानकारी जोड़ने से AI को बेहतर समझने में मदद मिलती है।"}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Coming Soon Modal */}
            <AnimatePresence>
                {showComingSoon && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowComingSoon(false)}
                    >
                        <motion.div
                            className="frosted-card max-w-sm w-full rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-slate-900/95 to-slate-800/95 p-8 shadow-2xl"
                            initial={{ scale: 0.8, y: 30, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.8, y: 30, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="mb-6 text-center">
                                <motion.div
                                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 ring-4 ring-emerald-500/30"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.1, type: "spring", damping: 15 }}
                                >
                                    <Rocket className="h-8 w-8 text-emerald-400" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white">
                                    जल्द आ रहा है!
                                </h3>
                                {suggestions?.vendingitems ? (
                                    <div className="mt-4 text-left">
                                        <p className="text-sm text-slate-400 mb-2">आपके लिए निम्नलिखित वस्तुओं की पहचान की गई है:</p>
                                        <div className="rounded-xl bg-emerald-500/10 p-3 border border-emerald-500/20 max-h-40 overflow-y-auto">
                                            <MarkdownRenderer content={suggestions.vendingitems} />
                                        </div>
                                        <p className="mt-3 text-xs text-slate-500 text-center">हम इन वस्तुओं को स्वचालित रूप से निकालने के लिए वेंडिंग मशीन को जोड़ रहे हैं।</p>
                                    </div>
                                ) : (
                                    <p className="mt-2 text-sm text-slate-400">
                                        वेंडिंग मशीन खरीद सुविधा जल्द आ रही है!
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <motion.button
                                    onClick={() => setShowComingSoon(false)}
                                    className="flex-1 rounded-full border-2 border-emerald-500/30 bg-emerald-500/10 px-6 py-3 font-semibold text-emerald-300 transition hover:border-emerald-500/50 hover:bg-emerald-500/20"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    ठीक है
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.header
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link
                        href="/hi/dashboard"
                        className="mb-4 inline-flex items-center gap-2 text-slate-300 transition hover:text-cyan-300"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>वापस जाएं</span>
                    </Link>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                            AI हेल्थ विश्लेषण
                        </h1>
                        <p className="text-lg text-slate-300">
                            अपनी समस्या बताएं या फोटो अपलोड करें, हमारा AI आपकी मदद करेगा।
                        </p>
                        <p className="text-sm text-slate-400">
                            यह केवल प्राथमिक उपचार के लिए है। गंभीर मामलों में डॉक्टर से मिलें।
                        </p>
                    </div>
                </motion.header>

                {/* Urgent Alert */}
                <AnimatePresence>
                    {showUrgentAlert && suggestions && (
                        <motion.div
                            className="mb-6 rounded-2xl border-2 border-red-500/50 bg-red-500/10 p-6 backdrop-blur"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="flex items-start gap-4">
                                <AlertTriangle className="h-8 w-8 shrink-0 text-red-400" />
                                <div className="flex-1">
                                    <h3 className="mb-2 text-xl font-semibold text-red-300">
                                        चेतावनी: गंभीर स्थिति का पता चला
                                    </h3>
                                    <p className="mb-4 text-slate-200">
                                        आपके लक्षणों के आधार पर, यह एक गंभीर स्थिति हो सकती है। कृपया तुरंत चिकित्सा सहायता लें।
                                    </p>
                                    <div className="flex gap-3">
                                        <motion.button
                                            className="rounded-full bg-red-500 px-6 py-2 font-semibold text-white shadow-lg"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            डॉक्टर को कॉल करें
                                        </motion.button>
                                        <motion.button
                                            className="rounded-full border border-red-500/50 bg-red-500/20 px-6 py-2 font-semibold text-red-300"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            अस्पताल खोजें
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Image Upload Section */}
                <motion.section
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="frosted-card rounded-3xl border border-white/10 p-6 sm:p-8">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500">
                                <Camera className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">
                                    फोटो अपलोड करें
                                </h2>
                                <p className="text-sm text-slate-400">
                                    चोट या प्रभावित क्षेत्र की स्पष्ट फोटो लें
                                </p>
                            </div>
                        </div>

                        {imagePreview ? (
                            <div className="relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imagePreview}
                                    alt="Uploaded"
                                    className="w-full max-h-[500px] object-contain rounded-2xl border border-white/20 bg-black/20"
                                />
                                <button
                                    onClick={removeImage}
                                    className="absolute right-4 top-4 rounded-full bg-red-500/90 p-2 text-white backdrop-blur transition hover:bg-red-500"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <motion.button
                                    onClick={handleCaptureClick}
                                    className="flex flex-1 items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-cyan-400/50 bg-cyan-400/10 px-6 py-12 transition hover:border-cyan-400 hover:bg-cyan-400/20"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Camera className="h-8 w-8 text-cyan-400" />
                                    <div className="text-left">
                                        <div className="font-semibold text-white">फोटो लें</div>
                                        <div className="text-sm text-slate-400">कैमरा का उपयोग करें</div>
                                    </div>
                                </motion.button>

                                <motion.button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex flex-1 items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-purple-400/50 bg-purple-400/10 px-6 py-12 transition hover:border-purple-400 hover:bg-purple-400/20"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Upload className="h-8 w-8 text-purple-400" />
                                    <div className="text-left">
                                        <div className="font-semibold text-white">अपलोड करें</div>
                                        <div className="text-sm text-slate-400">गैलरी से चुनें</div>
                                    </div>
                                </motion.button>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />

                        <p className="mt-4 text-sm text-slate-400">
                            <span className="font-medium text-cyan-300">सुझाव:</span> अच्छी रोशनी में फोटो लें और सुनिश्चित करें कि प्रभावित क्षेत्र स्पष्ट दिखाई दे।
                        </p>
                    </div>
                </motion.section>

                {/* Description Section */}
                <motion.section
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="frosted-card rounded-3xl border border-white/10 p-6 sm:p-8">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500">
                                <Stethoscope className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">
                                    लक्षणों का विवरण
                                </h2>
                                <p className="text-sm text-slate-400">
                                    अपनी समस्या के बारे में विस्तार से बताएं
                                </p>
                            </div>
                        </div>

                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="उदाहरण: मेरे हाथ पर कट लग गया है और खून बह रहा है..."
                            className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                            rows={4}
                        />

                        <div className="mt-4">
                            <p className="mb-2 text-sm font-medium text-slate-300">उदाहरण चुनें:</p>
                            <div className="flex flex-wrap gap-2">
                                {exampleDescriptions.map((exampleText, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => insertExample(exampleText)}
                                        className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {exampleText}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Analyze Button */}
                {(image || description.length > 0) && (
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-sky-500/40 transition disabled:opacity-50"
                            whileHover={!isAnalyzing ? { scale: 1.02 } : {}}
                            whileTap={!isAnalyzing ? { scale: 0.98 } : {}}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        विश्लेषण किया जा रहा है...
                                    </>
                                ) : (
                                    <>
                                        विश्लेषण शुरू करें
                                        <Sparkles className="h-5 w-5" />
                                    </>
                                )}
                            </span>
                            <span className="absolute inset-0 bg-white/20 opacity-0 transition group-hover:opacity-100" />
                        </motion.button>
                        <p className="mt-2 text-center text-sm text-slate-400">
                            AI आपके लक्षणों का विश्लेषण करके सुझाव देगा
                        </p>
                    </motion.div>
                )}

                {/* Results Section */}
                <AnimatePresence>
                    {suggestions && (
                        <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                        >
                            <div className="frosted-card rounded-3xl border border-white/10 p-6 sm:p-8">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500">
                                        <Activity className="h-6 w-6 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">विश्लेषण परिणाम</h2>
                                </div>

                                <div className="space-y-6">
                                    {/* Diagnosis */}
                                    <div className="rounded-2xl bg-white/5 p-5">
                                        <h3 className="mb-2 text-lg font-semibold text-cyan-300">निदान</h3>
                                        <MarkdownRenderer content={suggestions.diagnosis} />
                                    </div>

                                    {/* Medication / First Aid */}
                                    <div className="rounded-2xl bg-white/5 p-5">
                                        <div className="mb-2 flex items-center gap-2">
                                            <Pill className="h-5 w-5 text-emerald-400" />
                                            <h3 className="text-lg font-semibold text-emerald-300">दवा और प्राथमिक उपचार</h3>
                                        </div>
                                        <MarkdownRenderer content={suggestions.medication} />
                                    </div>

                                    {/* Prevention */}
                                    <div className="rounded-2xl bg-white/5 p-5">
                                        <div className="mb-2 flex items-center gap-2">
                                            <Shield className="h-5 w-5 text-amber-400" />
                                            <h3 className="text-lg font-semibold text-amber-300">रोकथाम</h3>
                                        </div>
                                        <MarkdownRenderer content={suggestions.prevention} />
                                    </div>

                                    {/* Vending Items */}
                                    {suggestions.vendingitems && suggestions.vendingitems.trim() && (
                                        <div className="rounded-2xl bg-white/5 p-5">
                                            <div className="mb-4 flex items-center gap-2">
                                                <ShoppingBag className="h-5 w-5 text-pink-400" />
                                                <h3 className="text-lg font-semibold text-pink-300">वेंडिंग मशीन में उपलब्ध</h3>
                                            </div>
                                            <MarkdownRenderer content={suggestions.vendingitems} />
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                    <motion.button
                                        onClick={() => setShowComingSoon(true)}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 font-semibold text-white shadow-lg transition hover:shadow-xl"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <CreditCard className="h-5 w-5" />
                                        वेंडिंग मशीन से खरीदें
                                    </motion.button>

                                    <motion.button
                                        onClick={() => {
                                            // Generate receipt
                                            window.print();
                                        }}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-cyan-400/50 bg-cyan-400/10 px-6 py-4 font-semibold text-cyan-300 transition hover:border-cyan-400 hover:bg-cyan-400/20"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <FileText className="h-5 w-5" />
                                        रसीद प्राप्त करें
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Privacy Note */}
                <motion.footer
                    className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 shrink-0 text-cyan-400" />
                        <div>
                            <p className="font-medium text-slate-300">गोपनीयता की गारंटी</p>
                            <p className="mt-1">
                                आपकी तस्वीरें और डेटा केवल विश्लेषण के लिए उपयोग किए जाते हैं और कभी भी सहेजे या साझा नहीं किए जाते हैं।
                            </p>
                        </div>
                    </div>
                </motion.footer>
            </div>

            {/* Camera Modal */}
            <AnimatePresence>
                {showCamera && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeCamera}
                        />
                        <motion.div
                            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/20 bg-slate-900 p-6 shadow-2xl"
                            initial={{ opacity: 0, scale: 0.9, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-white">फोटो लें</h3>
                                <button
                                    onClick={closeCamera}
                                    className="text-slate-400 transition hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="relative mb-4 overflow-hidden rounded-2xl bg-black">
                                <video
                                    ref={videoRef}
                                    className="w-full"
                                    autoPlay
                                    playsInline
                                    muted
                                />
                            </div>
                            <div className="flex gap-3">
                                <motion.button
                                    onClick={closeCamera}
                                    className="flex-1 rounded-full border border-white/30 bg-white/5 px-6 py-3 font-semibold text-slate-300 transition hover:bg-white/10"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    रद्द करें
                                </motion.button>
                                <motion.button
                                    onClick={capturePhoto}
                                    className="flex-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    फोटो लें
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
