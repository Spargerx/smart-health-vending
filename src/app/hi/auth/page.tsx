"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    CheckCircle2,
    XCircle,
    Camera,
    HelpCircle,
    ArrowLeft,
    Shield,
    AlertCircle,
    Upload,
} from "lucide-react";
import Link from "next/link";
import { setUserCookie } from "@/utils/cookies";

type AuthStatus =
    | "idle"
    | "requesting"
    | "ready"
    | "captured"
    | "verifying"
    | "success"
    | "fail"
    | "denied";

export default function HindiAuthPage() {
    const router = useRouter();
    const [status, setStatus] = useState<AuthStatus>("idle");
    const [message, setMessage] = useState("");
    const [userName, setUserName] = useState("छात्र");
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [capturedImageBlob, setCapturedImageBlob] = useState<Blob | null>(null);
    const [showHelp, setShowHelp] = useState(false);
    const [showVerifiedAnimation, setShowVerifiedAnimation] = useState(false);
    const [verificationFailed, setVerificationFailed] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const scanFrameRef = useRef<HTMLDivElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Function to stop camera and cleanup
    function stopCamera() {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => {
                track.stop();
            });
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            stopCamera();
        };
    }, []);

    // Stop camera when page becomes hidden (tab switch, minimize, etc.)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopCamera();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    // Stop camera before page unload
    useEffect(() => {
        const handleBeforeUnload = () => {
            stopCamera();
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            stopCamera(); // Also stop on cleanup
        };
    }, []);

    // Stop camera when component unmounts (navigation away)
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Capture image from video
    function captureImage() {
        if (!videoRef.current) return;

        try {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext("2d");

            if (!ctx) return;

            // Draw video frame to canvas
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            // Convert to data URL for preview
            const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
            setCapturedImage(dataUrl);

            // Convert to blob for submission
            canvas.toBlob((blob) => {
                if (blob) {
                    setCapturedImageBlob(blob);
                }
            }, "image/jpeg", 0.9);

            // Stop video stream
            stopCamera();

            setStatus("captured");
            setMessage("फोटो ले ली गई है। सत्यापित करने के लिए सबमिट करें।");
        } catch (error) {
            console.error("Error capturing image:", error);
            setMessage("फोटो लेने में विफल। कृपया पुनः प्रयास करें।");
        }
    }

    async function startCamera() {
        setStatus("requesting");
        setMessage("कैमरा एक्सेस का अनुरोध किया जा रहा है...");

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
            });
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }

            setStatus("ready");
            setMessage("अपने आईडी कार्ड को फ्रेम में रखें");
        } catch (err: unknown) {
            console.error("Camera error:", err);
            setStatus("denied");
            setMessage(
                "कैमरा एक्सेस अस्वीकृत। कृपया ब्राउज़र सेटिंग्स में अनुमति दें।"
            );
        }
    }

    async function submitImage() {
        if (!capturedImageBlob) {
            setMessage("सबमिट करने के लिए कोई फोटो नहीं है। कृपया पहले फोटो लें।");
            return;
        }

        setStatus("verifying");
        setMessage("सत्यापन जारी है...");
        setVerificationFailed(false);

        try {
            // Simulate network delay for demo
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock Success Response
            const mockBarcode = "STU12345678";
            const mockName = "छात्र";

            const mockProfile = {
                success: true,
                barcode: mockBarcode,
                name: mockName,
                uid: mockBarcode,
                fullName: "डेमो छात्र",
                age: 20,
                allergy: "कोई नहीं",
                number: "9876543210"
            };

            await handleVerificationSuccess(mockBarcode, mockName, mockProfile);

        } catch (error) {
            console.error("Error submitting image:", error);
            handleVerificationFail("डेमो सत्यापन के दौरान एक अप्रत्याशित त्रुटि हुई।");
        }
    }

    async function handleVerificationSuccess(barcodeText: string, name?: string | null, profileData?: Record<string, unknown>) {
        // Stop camera before showing success animation
        stopCamera();

        setStatus("success");
        setMessage("सत्यापन सफल!");
        setShowVerifiedAnimation(true);
        setVerificationFailed(false);
        // Use name from backend, or fallback to "Student" if not available
        setUserName(name || "छात्र");

        // Navigate to dashboard after animation
        setTimeout(async () => {
            // Ensure camera is stopped before navigation
            stopCamera();

            if (typeof window !== "undefined") {
                sessionStorage.setItem("studentId", barcodeText);
                if (name) {
                    sessionStorage.setItem("studentFirstName", name);
                }

                // Store profile in cookie if we have full data from barcode response
                if (profileData && profileData.fullName) {
                    setUserCookie({
                        uid: (profileData.uid as string) || barcodeText,
                        fullName: profileData.fullName as string,
                        name: name || "छात्र",
                        age: profileData.age as number | null,
                        allergy: profileData.allergy as string | null,
                        number: (profileData.number as string) || ""
                    });
                }
            }
            router.push("/hi/dashboard");
        }, 2500);
    }

    function handleVerificationFail(errorMessage: string) {
        stopCamera();
        setStatus("fail");
        setMessage(errorMessage);
        setVerificationFailed(true);
        setShowVerifiedAnimation(true);
    }

    function retakePhoto() {
        stopCamera();
        setCapturedImage(null);
        setCapturedImageBlob(null);
        setStatus("idle");
        setMessage("");
        setVerificationFailed(false);
    }

    function handleDevBypass() {
        setShowVerifiedAnimation(true);
        setStatus("success");
        setMessage("सत्यापन सफल!");
        setUserName("Developer");

        setTimeout(() => {
            router.push("/hi/dashboard");
        }, 2500);
    }

    function handleDevUpload() {
        fileInputRef.current?.click();
    }

    async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setMessage("कृपया एक इमेज फ़ाइल चुनें।");
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            setCapturedImage(dataUrl);
        };
        reader.readAsDataURL(file);

        // Convert to blob for submission
        setCapturedImageBlob(file);
        setStatus("captured");
        setMessage("फोटो ले ली गई है। सत्यापित करने के लिए सबमिट करें।");

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
            <div className="orbital-gradient" aria-hidden />
            <div className="grid-overlay" aria-hidden />

            {/* Hidden File Input for Dev Upload */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload Student ID image"
            />



            {/* Hidden Dev Bypass Button - Bottom right corner (hover to see) */}
            <button
                onClick={handleDevBypass}
                className="fixed bottom-4 right-4 z-50 h-10 w-10 rounded-full bg-red-500/20 border border-red-500/40 opacity-20 transition-all hover:opacity-100 hover:scale-110 hover:bg-red-500/40"
                aria-label="Developer bypass"
                title="Dev Bypass - Click to skip authentication"
            >
                <span className="text-xs text-red-400 font-bold">DEV</span>
            </button>

            {/* Verification Animation Overlay */}
            <AnimatePresence>
                {showVerifiedAnimation && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="flex flex-col items-center gap-6 text-center"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {verificationFailed ? (
                                // Failed Animation
                                <>
                                    <motion.div
                                        className="relative flex h-32 w-32 items-center justify-center"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [0, 1.2, 1] }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                    >
                                        <div className="absolute inset-0 rounded-full bg-red-500/20 blur-2xl" />
                                        <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-2xl shadow-red-500/50">
                                            <XCircle className="h-16 w-16 text-white" />
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <h2 className="text-3xl font-semibold text-white">
                                            सत्यापन विफल
                                        </h2>
                                        <p className="mt-2 text-lg text-slate-300">
                                            {message || "डेटाबेस में छात्र आईडी नहीं मिली।"}
                                        </p>
                                        <motion.button
                                            onClick={() => {
                                                setShowVerifiedAnimation(false);
                                                retakePhoto();
                                            }}
                                            className="mt-6 rounded-full bg-red-500/20 border border-red-400/50 px-6 py-3 text-white transition hover:bg-red-500/30"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            पुनः प्रयास करें
                                        </motion.button>
                                    </motion.div>
                                </>
                            ) : (
                                // Success Animation
                                <>
                                    <motion.div
                                        className="relative flex h-32 w-32 items-center justify-center"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [0, 1.2, 1] }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                    >
                                        <div className="absolute inset-0 rounded-full bg-green-500/20 blur-2xl" />
                                        <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-2xl shadow-green-500/50">
                                            <CheckCircle2 className="h-16 w-16 text-white" />
                                        </div>
                                        {!prefersReducedMotion && (
                                            <motion.div
                                                className="absolute inset-0"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: [0, 1, 0] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            >
                                                {[...Array(16)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        className="absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-green-400"
                                                        initial={{
                                                            x: 0,
                                                            y: 0,
                                                            opacity: 1,
                                                            scale: 1,
                                                        }}
                                                        animate={{
                                                            x: Math.cos((i * Math.PI * 2) / 16) * 120,
                                                            y: Math.sin((i * Math.PI * 2) / 16) * 120,
                                                            opacity: 0,
                                                            scale: 0,
                                                        }}
                                                        transition={{
                                                            duration: 1.5,
                                                            delay: i * 0.05,
                                                            repeat: Infinity,
                                                        }}
                                                    />
                                                ))}
                                            </motion.div>
                                        )}
                                    </motion.div>
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <h2 className="text-3xl font-semibold text-white">
                                            सत्यापन सफल!
                                        </h2>
                                        <p className="mt-2 text-lg text-slate-300">
                                            स्वागत है, {userName}!
                                        </p>
                                        <p className="mt-4 text-sm text-slate-400">
                                            डैशबोर्ड पर ले जाया जा रहा है...
                                        </p>
                                    </motion.div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.header
                    className="mb-8 flex items-center gap-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link
                        href="/hi"
                        onClick={stopCamera}
                        className="group flex items-center gap-2 text-slate-300 transition hover:text-cyan-300"
                    >
                        <ArrowLeft className="h-5 w-5 transition group-hover:-translate-x-1" />
                        <span className="text-sm">वापस जाएं</span>
                    </Link>
                    <div className="flex-1" />
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Shield className="h-4 w-4 text-cyan-400" />
                        <span>सुरक्षित कनेक्शन</span>
                    </div>
                </motion.header>

                {/* Main Content */}
                <main className="flex-1">
                    <motion.div
                        className="mx-auto max-w-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        {/* Title Section */}
                        <div className="mb-8 text-center">
                            <h1 className="mb-3 text-3xl font-semibold text-white sm:text-4xl">
                                छात्र सत्यापन
                            </h1>
                            <p className="text-lg text-slate-300">
                                कृपया पहुंच प्राप्त करने के लिए अपना आईडी कार्ड स्कैन करें
                            </p>
                        </div>

                        {/* Scanner Card */}
                        <motion.div
                            className="frosted-card rounded-3xl p-6 sm:p-8"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.5,
                                delay: 0.2,
                                ease: [0.22, 0.9, 0.27, 1],
                            }}
                        >
                            {/* Scanner Area */}
                            <div
                                className="relative mb-6 overflow-hidden rounded-2xl border-2 border-dashed border-white/20 bg-black/30"
                                aria-live="polite"
                            >
                                <div className="relative aspect-video w-full">
                                    {/* Corner Guides */}
                                    <div className="pointer-events-none absolute inset-4 z-10">
                                        <span className="absolute left-0 top-0 h-10 w-10 border-l-4 border-t-4 border-cyan-300/70" />
                                        <span className="absolute right-0 top-0 h-10 w-10 border-r-4 border-t-4 border-cyan-300/70" />
                                        <span className="absolute left-0 bottom-0 h-10 w-10 border-b-4 border-l-4 border-cyan-300/70" />
                                        <span className="absolute right-0 bottom-0 h-10 w-10 border-b-4 border-r-4 border-cyan-300/70" />
                                    </div>

                                    {/* Idle State */}
                                    {status === "idle" && (
                                        <motion.div
                                            className="flex h-full items-center justify-center p-8 text-center"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-center gap-6">
                                                    {/* Camera Button */}
                                                    <motion.button
                                                        onClick={startCamera}
                                                        className="group flex flex-col items-center gap-2 transition-transform"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-cyan-400/40 bg-cyan-400/10 transition-all group-hover:border-cyan-400/70 group-hover:bg-cyan-400/20 group-hover:shadow-lg group-hover:shadow-cyan-400/30">
                                                            <Camera className="h-10 w-10 text-cyan-400 transition-transform group-hover:scale-110" />
                                                        </div>
                                                        <p className="text-sm font-medium text-slate-300 group-hover:text-cyan-300">कैमरा</p>
                                                    </motion.button>

                                                    <div className="text-slate-500">या</div>

                                                    {/* Upload Button */}
                                                    <motion.button
                                                        onClick={handleDevUpload}
                                                        className="group flex flex-col items-center gap-2 transition-transform"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-purple-400/40 bg-purple-400/10 transition-all group-hover:border-purple-400/70 group-hover:bg-purple-400/20 group-hover:shadow-lg group-hover:shadow-purple-400/30">
                                                            <Upload className="h-10 w-10 text-purple-400 transition-transform group-hover:scale-110" />
                                                        </div>
                                                        <p className="text-sm font-medium text-slate-300 group-hover:text-purple-300">अपलोड</p>
                                                    </motion.button>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-200">
                                                        अपना आईडी कार्ड स्कैन या अपलोड करें
                                                    </p>
                                                    <p className="mt-1 text-sm text-slate-400">
                                                        कैमरा से स्कैन करें या गैलरी से फोटो चुनें
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Video Feed */}
                                    {(status === "ready" || status === "requesting") && (
                                        <>
                                            <video
                                                ref={videoRef}
                                                className="h-full w-full object-cover"
                                                playsInline
                                                muted
                                                autoPlay
                                            />
                                            {/* Alignment Guide */}
                                            {status === "ready" && (
                                                <div
                                                    ref={scanFrameRef}
                                                    className="absolute inset-4 flex items-center justify-center"
                                                >
                                                    <div className="relative h-[60%] w-[86%] rounded-lg border-4 border-cyan-300/70">
                                                        {/* Guide Text */}
                                                        <div className="absolute inset-0 flex items-end justify-center pb-2">
                                                            <span className="rounded bg-white/90 px-3 py-1 text-xs font-medium text-slate-900 shadow-lg">
                                                                बारकोड को यहां संरेखित करें
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* Captured Image Preview */}
                                    {status === "captured" && capturedImage && (
                                        <motion.img
                                            src={capturedImage}
                                            alt="Captured Student ID"
                                            className="h-full w-full object-contain"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}

                                    {/* Verifying State */}
                                    {status === "verifying" && (
                                        <motion.div
                                            className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <div className="text-center">
                                                <motion.div
                                                    className="mx-auto mb-4 h-16 w-16 rounded-full border-4 border-cyan-400 border-t-transparent"
                                                    animate={{ rotate: 360 }}
                                                    transition={{
                                                        duration: 1,
                                                        repeat: Infinity,
                                                        ease: "linear",
                                                    }}
                                                />
                                                <p className="text-lg font-medium text-white">सत्यापन किया जा रहा है...</p>
                                            </div>
                                        </motion.div>
                                    )}


                                    {/* Denied State */}
                                    {status === "denied" && (
                                        <motion.div
                                            className="flex h-full flex-col items-center justify-center gap-4 p-8 text-yellow-400"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/20">
                                                <AlertCircle className="h-10 w-10" />
                                            </div>
                                            <div className="text-center text-sm">
                                                कैमरा एक्सेस अस्वीकृत
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="mb-6 space-y-3 text-sm text-slate-300">
                                <div className="flex items-start gap-2">
                                    <span className="mt-0.5 text-cyan-400">1.</span>
                                    <span>&apos;कैमरा से स्कैन करें&apos; या &apos;फोटो अपलोड करें&apos; चुनें।</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="mt-0.5 text-cyan-400">2.</span>
                                    <span>अपने आईडी कार्ड के बारकोड को फ्रेम के अंदर रखें।</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="mt-0.5 text-cyan-400">3.</span>
                                    <span>
                                        स्पष्ट फोटो लें और सत्यापित करने के लिए &apos;सबमिट करें&apos; पर टैप करें।
                                    </span>
                                </div>
                            </div>

                            {/* Helpful Tips */}
                            <motion.div
                                className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-amber-300">
                                    <HelpCircle className="h-4 w-4" />
                                    स्कैनिंग टिप्स
                                </div>
                                <ul className="space-y-1 text-xs text-amber-200/90">
                                    <li>
                                        • सुनिश्चित करें कि पर्याप्त रोशनी है
                                    </li>
                                    <li>
                                        • कार्ड को स्थिर रखें और चमक से बचें
                                    </li>
                                    <li>
                                        • पूरा बारकोड दिखाई देना चाहिए
                                    </li>
                                </ul>
                            </motion.div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                {status === "ready" && (
                                    <motion.button
                                        onClick={captureImage}
                                        className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-sky-500/40 transition"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            <Camera className="h-5 w-5" />
                                            फोटो लें
                                        </span>
                                        <span className="absolute inset-0 bg-white/20 opacity-0 transition group-hover:opacity-100" />
                                    </motion.button>
                                )}

                                {status === "captured" && (
                                    <div className="space-y-3">
                                        <motion.button
                                            onClick={submitImage}
                                            className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-green-500/40 transition"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                <CheckCircle2 className="h-5 w-5" />
                                                सबमिट करें
                                            </span>
                                            <span className="absolute inset-0 bg-white/20 opacity-0 transition group-hover:opacity-100" />
                                        </motion.button>
                                        <motion.button
                                            onClick={retakePhoto}
                                            className="w-full rounded-full border border-white/30 bg-white/5 px-6 py-4 text-base font-semibold text-slate-100 transition hover:border-cyan-300 hover:bg-white/10 hover:text-white"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            दोबारा लें
                                        </motion.button>
                                    </div>
                                )}

                                {status === "requesting" && (
                                    <div className="flex items-center justify-center gap-2 rounded-full bg-slate-800/50 px-6 py-4">
                                        <motion.div
                                            className="h-5 w-5 rounded-full border-2 border-cyan-400 border-t-transparent"
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                        />
                                        <span className="text-base font-medium text-slate-300">
                                            कैमरा शुरू हो रहा है...
                                        </span>
                                    </div>
                                )}

                                {status !== "verifying" && status !== "success" && status !== "fail" && (
                                    <button
                                        onClick={() => setShowHelp(!showHelp)}
                                        className="w-full text-center text-sm text-cyan-400 underline transition hover:text-cyan-300"
                                    >
                                        मदद चाहिए?
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </main>
            </div>

            {/* Help Modal */}
            <AnimatePresence>
                {showHelp && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowHelp(false)}
                        />
                        <motion.div
                            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/20 bg-slate-900 p-6 shadow-2xl"
                            initial={{ opacity: 0, scale: 0.9, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-white">सहायता</h3>
                                <button
                                    onClick={() => setShowHelp(false)}
                                    className="rounded-full bg-white/10 p-2 text-slate-400 transition hover:bg-white/20 hover:text-white"
                                >
                                    <XCircle className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="space-y-4 text-slate-300">
                                <p>
                                    <strong>स्कैन नहीं हो रहा?</strong> सुनिश्चित करें कि बारकोड साफ है और पर्याप्त रोशनी है।
                                </p>
                                <p>
                                    <strong>आईडी नहीं है?</strong> आप मैन्युअल रूप से अपना आईडी नंबर दर्ज करने के लिए व्यवस्थापक से संपर्क कर सकते हैं।
                                </p>
                                <p>
                                    <strong>कैमरा काम नहीं कर रहा?</strong> अपने ब्राउज़र की अनुमति सेटिंग्स की जाँच करें या पृष्ठ को रीफ्रेश करें।
                                </p>
                            </div>
                            <button
                                onClick={() => setShowHelp(false)}
                                className="mt-6 w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-white transition hover:bg-cyan-400"
                            >
                                समझ गया
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
