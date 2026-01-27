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
} from "lucide-react";
import Link from "next/link";
import { getUserCookie } from "@/utils/cookies";

interface AISuggestion {
  diagnosis: string;
  medication: string;
  prevention: string;
  vendingitems: string;
  raw?: string;
}

// Improved Rich Text Renderer for AI Output
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
  "I have a deep cut on my finger and it's bleeding",
  "I have a red itchy rash on my arm",
  "I burned my hand on a hot stove",
  "My ankle is swollen and painful",
];

export default function HealthAnalysisPage() {
  const [userUid, setUserUid] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion | null>(null);
  const [analysisTimestamp, setAnalysisTimestamp] = useState<string | null>(null);
  const [showUrgentAlert, setShowUrgentAlert] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [validationError, setValidationError] = useState<{ needsImage: boolean; needsDescription: boolean } | null>(null);


  useEffect(() => {
    if (typeof window !== "undefined") {
      // Try sessionStorage first
      let uid = sessionStorage.getItem("studentId");

      // Fallback to cookies if sessionStorage is empty
      if (!uid) {
        const userProfile = getUserCookie();
        if (userProfile?.uid) {
          uid = userProfile.uid;
        }
      }

      setUserUid(uid);
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
        alert("Camera access denied. Please use upload instead.");
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
        diagnosis: "**Mock Diagnosis**: Based on the description/image, this appears to be a minor abrasion.",
        medication: "**Treatment Steps:**\n1. Clean the area with antiseptic wipes.\n2. Apply antibiotic ointment.\n3. Cover with a sterile bandage.",
        prevention: "Keep the area clean and dry. Watch for signs of infection like increased redness or swelling.",
        vendingitems: "Bandages, Antiseptic Wipes",
        raw: "Raw mock data"
      };

      const timestamp = new Date().toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short'
      });
      setAnalysisTimestamp(timestamp);
      setSuggestions({
        diagnosis: result.diagnosis,
        medication: result.medication,
        prevention: result.prevention,
        vendingitems: result.vendingitems || "",
        raw: result.raw
      });

      // Simple urgency check based on keywords in diagnosis
      const urgentKeywords = ["severe", "emergency", "doctor", "hospital", "immediate attention"];
      const isUrgent = urgentKeywords.some(k => result.diagnosis?.toLowerCase().includes(k) || result.medication?.toLowerCase().includes(k));
      setShowUrgentAlert(isUrgent);

    } catch (error) {
      console.error("Analysis error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function insertExample(exampleKey: string) {
    setDescription(exampleKey);
  }

  return (
    <>
      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          /* Hide everything except the receipt */
          body * {
            visibility: hidden;
          }
          
          #receipt-content,
          #receipt-content * {
            visibility: visible;
          }
          
          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
          }
          
          /* Reset backgrounds and colors for print */
          * {
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            text-shadow: none !important;
          }
          
          /* Page setup */
          @page {
            margin: 1cm;
            size: A4;
          }
          
          /* Typography for print */
          body {
            font-size: 12pt;
            line-height: 1.5;
          }
          
          h1 { font-size: 24pt; font-weight: bold; }
          h2 { font-size: 18pt; font-weight: bold; }
          h3 { font-size: 14pt; font-weight: bold; }
          
          /* Borders and spacing */
          .print-border {
            border: 2px solid black !important;
            padding: 1rem !important;
            margin: 0.5rem 0 !important;
          }
          
          .print-header {
            border-bottom: 3px solid black !important;
            padding-bottom: 1rem !important;
            margin-bottom: 1rem !important;
          }
          
          .print-section {
            page-break-inside: avoid;
            margin: 1rem 0 !important;
            padding: 0.75rem !important;
            border: 1px solid #333 !important;
          }
          
          .print-section-title {
            font-weight: bold !important;
            font-size: 14pt !important;
            margin-bottom: 0.5rem !important;
          }
          
          /* Hide decorative elements */
          .orbital-gradient,
          .grid-overlay,
          .watermark-logo,
          button,
          nav,
          .print-hide {
            display: none !important;
          }
          
          /* List styling */
          ul, ol {
            margin-left: 1.5rem !important;
          }
          
          li {
            margin: 0.25rem 0 !important;
          }
        }
      `}</style>
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
                    {"Almost There!"}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {validationError.needsImage && validationError.needsDescription
                      ? "Please complete the following to analyze your symptoms"
                      : "Please complete this requirement to analyze your symptoms"}
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
                        <div className="font-semibold text-white">{"Upload an Image"}</div>
                        <div className="mt-1 text-sm text-slate-300">
                          {"Take or upload a clear photo of the affected area"}
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
                        <div className="font-semibold text-white">{"Describe Your Symptoms"}</div>
                        <div className="mt-1 text-sm text-slate-300">
                          {"Tell us how you're feeling (at least 10 characters)"}
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
                    {"Got it"}
                  </motion.button>
                </div>

                {/* Helper Text */}
                <p className="mt-4 text-center text-xs text-slate-500">
                  {validationError.needsImage && validationError.needsDescription
                    ? "Both items are required for accurate AI analysis"
                    : "This item is required for accurate AI analysis"}
                </p>
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
              href="/en/dashboard"
              className="mb-4 inline-flex items-center gap-2 text-slate-300 transition hover:text-cyan-300"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>{"Back to Dashboard"}</span>
            </Link>

            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                {"Get AI Health Assistance"}
              </h1>
              <p className="text-lg text-slate-300">
                {"Tell us what's bothering you, we'll guide you safely."}
              </p>
              <p className="text-sm text-slate-400">
                {"Our AI will analyze your symptoms and recommend safe first-aid steps."}
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
                      {"Urgent attention recommended"}
                    </h3>
                    <p className="mb-4 text-slate-200">
                      {"Please seek medical help nearby. This appears to be a serious condition that requires professional medical attention."}
                    </p>
                    <div className="flex gap-3">
                      <motion.button
                        className="rounded-full bg-red-500 px-6 py-2 font-semibold text-white shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {"Call Nearby Doctor"}
                      </motion.button>
                      <motion.button
                        className="rounded-full border border-red-500/50 bg-red-500/20 px-6 py-2 font-semibold text-red-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {"Show Hospital List"}
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
                    {"Upload or Capture the Affected Area"}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {"Take a clear photo using the machine camera or upload from your phone"}
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
                      <div className="font-semibold text-white">{"Capture Image"}</div>
                      <div className="text-sm text-slate-400">{"Use machine camera"}</div>
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
                      <div className="font-semibold text-white">{"Upload Image"}</div>
                      <div className="text-sm text-slate-400">{"From your device"}</div>
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
                <span className="font-medium text-cyan-300">{"Tip:"}</span> {"If it's a cut, rash, burn, swelling, or skin irritation - this helps the AI understand it better."}
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
                    {"Add a Description"}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {"Describe your issue in your own words."}
                  </p>
                </div>
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={"Describe your symptoms..."}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                rows={4}
              />

              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-slate-300">{"Examples you can use:"}</p>
                <div className="flex flex-wrap gap-2">
                  {exampleDescriptions.map((exampleKey) => (
                    <motion.button
                      key={exampleKey}
                      onClick={() => insertExample(exampleKey)}
                      className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {exampleKey}
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
                      {"Analyzing..."}
                    </>
                  ) : (
                    <>
                      {"Analyze My Issue"}
                      <Sparkles className="h-5 w-5" />
                    </>
                  )}
                </span>
                <span className="absolute inset-0 bg-white/20 opacity-0 transition group-hover:opacity-100" />
              </motion.button>
              <p className="mt-2 text-center text-sm text-slate-400">
                {"Takes ~3 seconds. Your data stays private."}
              </p>
            </motion.div>
          )}

          {/* Results Section */}
          <AnimatePresence>
            {suggestions && (
              <motion.div
                id="receipt-content"
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                {/* Print-only Receipt Header */}
                <div className="hidden print:block print-header">
                  <div className="text-center mb-4">
                    <h1 className="text-3xl font-bold mb-2">CureGenie</h1>
                    <p className="text-lg">Smart Health Assistance - Medical Analysis Report</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Patient ID:</strong> {userUid || 'N/A'}
                    </div>
                    <div>
                      <strong>Analysis Date:</strong> {analysisTimestamp || new Date().toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Patient Input Section - Print Only */}
                <div className="hidden print:block print-section mt-4">
                  <h3 className="print-section-title mb-3">Patient Input</h3>

                  {/* Uploaded Image */}
                  {imagePreview && (
                    <div className="mb-4">
                      <p className="font-semibold mb-2">Uploaded Image:</p>
                      <div className="border-2 border-black p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imagePreview}
                          alt="Patient uploaded image"
                          className="max-w-full h-auto max-h-[300px] object-contain mx-auto"
                        />
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {description && (
                    <div>
                      <p className="font-semibold mb-2">Symptom Description:</p>
                      <p className="text-sm border border-black p-3 bg-gray-50">
                        {description}
                      </p>
                    </div>
                  )}
                </div>

                <div className="frosted-card rounded-3xl border border-white/10 p-6 sm:p-8">
                  <div className="mb-6 flex items-center gap-3 print-hide">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Diagnosis */}
                    <div className="rounded-2xl bg-white/5 p-5 print-section">
                      <h3 className="mb-2 text-lg font-semibold text-cyan-300 print-section-title">Diagnosis</h3>
                      <MarkdownRenderer content={suggestions.diagnosis} />
                    </div>

                    {/* Medication / First Aid */}
                    <div className="rounded-2xl bg-white/5 p-5 print-section">
                      <div className="mb-2 flex items-center gap-2">
                        <Pill className="h-5 w-5 text-emerald-400 print-hide" />
                        <h3 className="text-lg font-semibold text-emerald-300 print-section-title">Medication & First Aid</h3>
                      </div>
                      <MarkdownRenderer content={suggestions.medication} />
                    </div>

                    {/* Prevention */}
                    <div className="rounded-2xl bg-white/5 p-5 print-section">
                      <div className="mb-2 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-amber-400 print-hide" />
                        <h3 className="text-lg font-semibold text-amber-300 print-section-title">Prevention</h3>
                      </div>
                      <MarkdownRenderer content={suggestions.prevention} />
                    </div>

                    {/* Vending Items */}
                    {suggestions.vendingitems && suggestions.vendingitems.trim() && (
                      <div className="rounded-2xl bg-white/5 p-5 print-section">
                        <div className="mb-4 flex items-center gap-2">
                          <ShoppingBag className="h-5 w-5 text-pink-400 print-hide" />
                          <h3 className="text-lg font-semibold text-pink-300 print-section-title">Recommended Items</h3>
                        </div>
                        <MarkdownRenderer content={suggestions.vendingitems} />
                      </div>
                    )}
                  </div>


                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-center print-hide">
                    <motion.button
                      onClick={() => {
                        // Generate receipt
                        window.print();
                      }}
                      className="flex items-center justify-center gap-2 rounded-2xl border-2 border-cyan-400/50 bg-cyan-400/10 px-8 py-4 font-semibold text-cyan-300 transition hover:border-cyan-400 hover:bg-cyan-400/20"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FileText className="h-5 w-5" />
                      Get Receipt
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
                <p className="font-medium text-slate-300">{"Privacy Note"}</p>
                <p className="mt-1">
                  {"We don&apos;t store your photo. It&apos;s analyzed once and deleted immediately. Only a brief summary is kept for your receipt."}
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
                  <h3 className="text-xl font-semibold text-white">{"Capture Photo"}</h3>
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
                    {"Cancel"}
                  </motion.button>
                  <motion.button
                    onClick={capturePhoto}
                    className="flex-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {"Capture"}
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}