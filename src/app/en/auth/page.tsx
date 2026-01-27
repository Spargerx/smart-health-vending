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
import { useLanguage } from "@/context/LanguageContext";
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

// Constants
const REDIRECT_DELAY_MS = 2500;

export default function AuthPage() {
  const router = useRouter();
  const { refreshLanguage } = useLanguage();
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("Student");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedImageBlob, setCapturedImageBlob] = useState<Blob | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
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
      setMessage("Image captured! Review and submit to verify.");
    } catch (error) {
      console.error("Error capturing image:", error);
      setMessage("Failed to capture image. Please try again.");
    }
  }

  async function startCamera() {
    setStatus("requesting");
    setMessage("Requesting camera permission...");

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
      setMessage("Tap Scan and point your card toward the camera");
    } catch (err: unknown) {
      console.error("Camera error:", err);
      setStatus("denied");
      setMessage(
        "Camera access blocked. Allow camera permission in settings or talk to campus admin."
      );
    }
  }

  async function submitImage() {
    if (!capturedImageBlob) {
      setMessage("No image to submit. Please capture an image first.");
      return;
    }

    setStatus("verifying");
    setMessage("Verifying student ID...");
    setVerificationFailed(false);

    try {
      // Simulate network delay for demo
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock Success Response
      const mockBarcode = "STU12345678";
      const mockName = "Demo Student";

      const mockProfile = {
        success: true,
        barcode: mockBarcode,
        name: mockName,
        uid: mockBarcode,
        fullName: "Demo Student User",
        age: 20,
        allergy: "None",
        number: "555-0123"
      };

      handleVerificationSuccess(mockBarcode, mockName, mockProfile);

    } catch (error) {
      console.error("Error submitting image:", error);
      handleVerificationFail("An unexpected error occurred during demo verification.");
    }
  }

  async function handleVerificationSuccess(barcodeText: string, name?: string | null, profileData?: Record<string, unknown>) {
    // Stop camera before showing success animation
    stopCamera();

    setStatus("success");
    setMessage("Verification Successful!");
    setShowVerifiedAnimation(true);
    setVerificationFailed(false);
    // Use name from backend, or fallback to "Student" if not available
    setUserName(name || "Student");

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
            name: name || "Student",
            age: profileData.age as number | null,
            allergy: profileData.allergy as string | null,
            number: (profileData.number as string) || ""
          });
        }

        // Refresh language context to pick up user preference
        await refreshLanguage();
      }
      router.push("/en/dashboard");
    }, REDIRECT_DELAY_MS);
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

  function stopAndReset() {
    stopCamera();

    setStatus("idle");
    setMessage("");
    setCapturedImage(null);
    setCapturedImageBlob(null);
    setUserName("");
    setShowVerifiedAnimation(false);
    setVerificationFailed(false);
  }

  // Development helper function for upload
  function handleDevUpload() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
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
    setMessage("Image captured! Review and submit to verify.");

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleDevBypass() {
    handleVerificationSuccess("DEMO-JURY-BYPASS", "Jury Member", {
      uid: "DEMO-JURY-BYPASS",
      fullName: "Jury Member",
      name: "Jury Member",
      age: 0,
      allergy: "None",
      number: "0000000000"
    });
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

      {/* Demo Bypass Button - Visible for Jury Presentation */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <motion.div
          className="rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 backdrop-blur-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <p className="text-xs text-amber-200 font-medium">
            👇 For Jury: Skip Authentication
          </p>
        </motion.div>
        <motion.button
          onClick={handleDevBypass}
          className="group relative overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 shadow-lg shadow-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/60 hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <span className="relative z-10 flex items-center gap-2 text-sm font-bold text-white">
            <Shield className="h-4 w-4" />
            Demo Bypass
          </span>
          <span className="absolute inset-0 bg-white/20 opacity-0 transition group-hover:opacity-100" />
        </motion.button>
      </div>



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
                      {"Verification Failed"}
                    </h2>
                    <p className="mt-2 text-lg text-slate-300">
                      {message || "Student ID not found in database."}
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
                      {"Try Again"}
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
                      {"Verification Successful!"}
                    </h2>
                    <p className="mt-2 text-lg text-slate-300">
                      {"Welcome, "}{userName}!
                    </p>
                    <p className="mt-4 text-sm text-slate-400">
                      {"Redirecting to dashboard..."}
                    </p>
                  </motion.div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        {/* Jury Information Banner */}
        <motion.div
          className="mb-6 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-4 backdrop-blur-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/30">
              <AlertCircle className="h-5 w-5 text-amber-300" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-semibold text-amber-200">Prototype Demo Mode</h3>
              <p className="text-sm text-amber-100/90">
                <strong>For Jury Members:</strong> You can use the <strong>&quot;Demo Bypass&quot;</strong> button (bottom-right corner) to skip the authentication process and proceed directly to the dashboard.
              </p>
            </div>
          </div>
        </motion.div>
        {/* Header */}
        <motion.header
          className="mb-8 flex items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/en"
            onClick={stopCamera}
            className="group flex items-center gap-2 text-slate-300 transition hover:text-cyan-300"
          >
            <ArrowLeft className="h-5 w-5 transition group-hover:-translate-x-1" />
            <span className="text-sm">{"Back"}</span>
          </Link>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Shield className="h-4 w-4 text-cyan-400" />
            <span>{"Secure Verification"}</span>
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
                {"Verify Your Identity to Continue"}
              </h1>
              <p className="text-lg text-slate-300">
                {"Scan your Student ID — it helps us give you a personalized experience."}
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
                            <p className="text-sm font-medium text-slate-300 group-hover:text-cyan-300">{"Camera"}</p>
                          </motion.button>

                          <div className="text-slate-500">{"or"}</div>

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
                            <p className="text-sm font-medium text-slate-300 group-hover:text-purple-300">{"Upload"}</p>
                          </motion.button>
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">
                            {"Scan or Upload Your ID Card"}
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            {"Use camera to scan or upload from gallery"}
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
                                {"Align Student ID Card Here"}
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
                        <p className="text-lg font-medium text-white">{"Verifying..."}</p>
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
                        {"Camera access blocked. Allow camera permission in settings or talk to campus admin."}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-6 space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 text-cyan-400">1.</span>
                  <span>{"Hold your Student ID card inside the frame, aligning it with the corner guides."}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 text-cyan-400">2.</span>
                  <span>{"Ensure the card is flat and the barcode/ID number is clearly visible."}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 text-cyan-400">3.</span>
                  <span>
                    Tap &quot;Capture Image&quot; to take the photo, then tap &quot;Submit for Verification&quot; to verify your ID.
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
                  {"Helpful Tips"}
                </div>
                <ul className="space-y-1 text-xs text-amber-200/90">
                  <li>
                    • {"If barcode isn't reading: clean the card, increase ambient light, or try rotating the card 90°."}
                  </li>
                  <li>
                    • {"Don't have your card? Contact campus admin for verification assistance."}
                  </li>
                  <li>
                    • {"We only store a masked ID token for audits — we don't save your full ID number."}
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
                      {"Capture Image"}
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
                        {"Submit for Verification"}
                      </span>
                      <span className="absolute inset-0 bg-white/20 opacity-0 transition group-hover:opacity-100" />
                    </motion.button>
                    <motion.button
                      onClick={retakePhoto}
                      className="w-full rounded-full border border-white/30 bg-white/5 px-6 py-4 text-base font-semibold text-slate-100 transition hover:border-cyan-300 hover:bg-white/10 hover:text-white"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {"Retake Photo"}
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
                      {"Requesting camera permission..."}
                    </span>
                  </div>
                )}

                {status !== "verifying" && status !== "success" && status !== "fail" && (
                  <button
                    onClick={() => setShowHelp(!showHelp)}
                    className="w-full text-center text-sm text-cyan-400 underline transition hover:text-cyan-300"
                  >
                    {"Need Help?"}
                  </button>
                )}
              </div>

              {/* Status Message */}
              {message && (
                <motion.div
                  className="mt-4 text-center text-sm text-slate-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {message}
                </motion.div>
              )}

              {/* Try Again / Actions */}
              {status === "denied" && (
                <motion.div
                  className="mt-4 flex gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <button
                    onClick={stopAndReset}
                    className="flex-1 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-300 hover:text-white"
                  >
                    Try again
                  </button>
                  <button
                    onClick={() => setShowHelp(true)}
                    className="flex-1 rounded-full border border-cyan-400/50 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-400/20"
                  >
                    Need help?
                  </button>
                </motion.div>
              )}

              {/* Privacy Notice */}
              <div className="mt-6 border-t border-white/10 pt-4">
                <button
                  onClick={() => setShowPrivacy(!showPrivacy)}
                  className="w-full text-left text-xs text-slate-400 transition hover:text-slate-300"
                >
                  <span className="flex items-center justify-between">
                    <span>
                      We only store a masked student token and an audit log
                      (timestamp, device). No full ID or biometric data is
                      stored. By continuing you consent to this verification.
                    </span>
                    <span className="ml-2 text-cyan-400">
                      {showPrivacy ? "▲" : "▼"} Privacy details
                    </span>
                  </span>
                </button>
                <AnimatePresence>
                  {showPrivacy && (
                    <motion.div
                      className="mt-3 space-y-2 text-xs text-slate-400"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <p>
                        • Masked token: Only the last 4 digits of your student ID
                        are stored in an encrypted format.
                      </p>
                      <p>
                        • Audit log: Timestamp and device fingerprint (no
                        personal data).
                      </p>
                      <p>
                        • No biometrics: We do not capture or store any
                        biometric information.
                      </p>
                      <p>
                        • Data retention: Audit logs are deleted after 90 days.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
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
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
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
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Need Help?</h3>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-slate-400 transition hover:text-white"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3 text-sm text-slate-300">
                <p>
                  If you&apos;re having trouble scanning your Student ID card, try
                  these steps:
                </p>
                <ul className="space-y-2 pl-4">
                  <li>• Clean the barcode area with a soft cloth</li>
                  <li>• Ensure good lighting in the room</li>
                  <li>• Rotate the card 90 degrees and try again</li>
                  <li>• Hold the card steady for 3-5 seconds</li>
                  <li>• Reach out to the campus admin if you need manual verification</li>
                </ul>
                <p className="pt-2 text-xs text-slate-400">
                  Still having issues? Contact campus admin for assistance.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}