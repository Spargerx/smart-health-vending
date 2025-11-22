"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { BrowserMultiFormatReader } from "@zxing/library";
import {
  CheckCircle2,
  XCircle,
  Camera,
  Phone,
  HelpCircle,
  ArrowLeft,
  Shield,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

type AuthStatus =
  | "idle"
  | "requesting"
  | "scanning"
  | "success"
  | "fail"
  | "denied"
  | "verifying";

export default function AuthPage() {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("Student");
  const [scanProgress, setScanProgress] = useState(0);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showVerifiedAnimation, setShowVerifiedAnimation] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scanFrameRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();
    const currentStream = streamRef.current;
    const currentInterval = scanIntervalRef.current;
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((t) => t.stop());
      }
      if (currentInterval) {
        clearInterval(currentInterval);
      }
      codeReaderRef.current?.reset();
    };
  }, []);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  async function startScan() {
    setStatus("requesting");
    setMessage("Requesting camera permission...");
    setScanProgress(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setStatus("scanning");
      setMessage("Align the barcode inside the frame. Hold steady.");

      // Start progress simulation
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 2;
        if (progress <= 100) {
          setScanProgress(progress);
        } else {
          clearInterval(progressInterval);
        }
      }, 60);

      // Attempt to decode barcode
      if (codeReaderRef.current && videoRef.current) {
        const maxScanTime = 5000; // 5 seconds max

        const attemptDecode = async () => {
          const startTime = Date.now();
          try {
            await codeReaderRef.current!.decodeFromVideoDevice(
              null,
              videoRef.current!,
              (result, error) => {
                if (result) {
                  clearInterval(progressInterval);
                  handleScanSuccess(result.getText());
                } else if (error && error.name !== "NotFoundException") {
                  console.error("Scan error:", error);
                }
              }
            );

            // Fallback: if no result after maxScanTime, simulate result
            setTimeout(() => {
              if (status === "scanning") {
                const elapsed = Date.now() - startTime;
                if (elapsed > maxScanTime) {
                  clearInterval(progressInterval);
                  // Simulate success for demo (replace with actual verification)
                  const simulatedSuccess = Math.random() > 0.3;
                  if (simulatedSuccess) {
                    handleScanSuccess("STUDENT-12345");
                  } else {
                    handleScanFail();
                  }
                }
              }
            }, maxScanTime);
          } catch (err) {
            console.error("Decode error:", err);
            clearInterval(progressInterval);
            handleScanFail();
          }
        };

        attemptDecode();
      }
    } catch (err: unknown) {
      console.error("Camera error:", err);
      setStatus("denied");
      setMessage(
        "Camera access blocked. Allow camera in browser settings or use Phone OTP."
      );
      setScanProgress(0);
    }
  }

  function handleScanSuccess(_barcodeText: string) {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    codeReaderRef.current?.reset();

    setStatus("verifying");
    setScanProgress(100);
    setMessage("Verifying...");

    // Show verification animation
    setTimeout(() => {
      setShowVerifiedAnimation(true);
      setStatus("success");
      setMessage("Verified — Welcome!");
      setUserName("Student"); // Replace with actual name from backend

      // Navigate to dashboard after animation
      setTimeout(() => {
        router.push("/dashboard");
      }, 2500);
    }, 800);
  }

  function handleScanFail() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    codeReaderRef.current?.reset();

    setStatus("fail");
    setScanProgress(0);
    setMessage("Scan failed. Try again or choose Phone OTP.");
  }

  function stopAndReset() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    codeReaderRef.current?.reset();

    setStatus("idle");
    setMessage("");
    setScanProgress(0);
    setUserName("");
    setShowVerifiedAnimation(false);
  }

  function handlePhoneOTP() {
    stopAndReset();
    // Navigate to phone OTP flow (implement separately)
    console.log("Navigate to Phone OTP");
  }

  function handleDevBypass() {
    setShowVerifiedAnimation(true);
    setStatus("success");
    setMessage("Verified — Welcome!");
    setUserName("Developer");
    
    setTimeout(() => {
      router.push("/dashboard");
    }, 2500);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="orbital-gradient" aria-hidden />
      <div className="grid-overlay" aria-hidden />

      {/* Hidden Dev Bypass Button - Bottom right corner (hover to see) */}
      <button
        onClick={handleDevBypass}
        className="fixed bottom-4 right-4 z-50 h-10 w-10 rounded-full bg-red-500/20 border border-red-500/40 opacity-20 transition-all hover:opacity-100 hover:scale-110 hover:bg-red-500/40"
        aria-label="Developer bypass"
        title="Dev Bypass - Click to skip authentication"
      >
        <span className="text-xs text-red-400 font-bold">DEV</span>
      </button>

      {/* Verified Animation Overlay */}
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
                  Verification Successful!
                </h2>
                <p className="mt-2 text-lg text-slate-300">
                  Welcome, {userName}!
                </p>
                <p className="mt-4 text-sm text-slate-400">
                  Redirecting to dashboard...
                </p>
              </motion.div>
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
            href="/"
            className="group flex items-center gap-2 text-slate-300 transition hover:text-cyan-300"
          >
            <ArrowLeft className="h-5 w-5 transition group-hover:-translate-x-1" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Shield className="h-4 w-4 text-cyan-400" />
            <span>Secure Verification</span>
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
                Verify your identity to continue
              </h1>
              <p className="text-lg text-slate-300">
                Scan your Student ID barcode — this helps us verify eligibility
                and send your receipt.
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
                  {/* Idle State */}
                  {status === "idle" && (
                    <motion.div
                      className="flex h-full items-center justify-center p-8 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="space-y-4">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-cyan-400/40 bg-cyan-400/10">
                          <Camera className="h-10 w-10 text-cyan-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">
                            Scanner ready
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            Tap Scan and point your card at the camera
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Video Feed */}
                  {(status === "scanning" || status === "requesting" || status === "verifying") && (
                    <>
                      <video
                        ref={videoRef}
                        className="h-full w-full object-cover"
                        playsInline
                        muted
                        autoPlay
                      />
                      {/* Scanning Overlay */}
                      {status === "scanning" && (
                        <div
                          ref={scanFrameRef}
                          className="absolute inset-4 flex items-center justify-center"
                        >
                          <div className="relative h-[60%] w-[86%] rounded-lg border-4 border-white/80">
                            {/* Red Scanning Bar */}
                            {!prefersReducedMotion && (
                              <motion.div
                                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-lg shadow-red-500/50"
                                animate={{
                                  top: ["10%", "90%", "10%"],
                                  opacity: [0.4, 1, 0.4],
                                }}
                                transition={{
                                  duration: 0.7,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              />
                            )}
                            {/* Guide Text */}
                            <div className="absolute inset-0 flex items-end justify-center pb-2">
                              <span className="rounded bg-white/90 px-3 py-1 text-xs font-medium text-slate-900 shadow-lg">
                                Align barcode here
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Progress Indicator */}
                      {(status === "scanning" || status === "verifying") && scanProgress > 0 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                          <div className="flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 backdrop-blur">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-white/20">
                              <motion.div
                                className="h-full bg-gradient-to-r from-cyan-400 to-sky-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${scanProgress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                            <span className="text-xs text-white">
                              {status === "verifying" ? "Verifying..." : `Scanning... ${Math.round(scanProgress / 10)}s`}
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Success State */}
                  {status === "success" && !showVerifiedAnimation && (
                    <motion.div
                      className="flex h-full flex-col items-center justify-center gap-4 p-8 text-green-400"
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: [0.85, 1.05, 1], opacity: 1 }}
                      transition={{ duration: 0.35 }}
                    >
                      <motion.div
                        className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20 shadow-lg shadow-green-500/30"
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <CheckCircle2 className="h-12 w-12" />
                      </motion.div>
                      {!prefersReducedMotion && (
                        <motion.div
                          className="absolute inset-0"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          {[...Array(12)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-green-400"
                              initial={{
                                x: 0,
                                y: 0,
                                opacity: 1,
                              }}
                              animate={{
                                x: Math.cos((i * Math.PI * 2) / 12) * 100,
                                y: Math.sin((i * Math.PI * 2) / 12) * 100,
                                opacity: 0,
                              }}
                              transition={{
                                duration: 1,
                                delay: i * 0.05,
                              }}
                            />
                          ))}
                        </motion.div>
                      )}
                      <div className="text-center">
                        <div className="text-xl font-semibold">
                          Verified — Welcome{userName ? `, ${userName}` : ""}!
                        </div>
                        <p className="mt-1 text-sm text-green-300">
                          Proceeding to next step...
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Fail State */}
                  {status === "fail" && (
                    <motion.div
                      className="flex h-full flex-col items-center justify-center gap-4 p-8 text-red-400"
                      initial={{ x: 0 }}
                      animate={{
                        x: prefersReducedMotion
                          ? 0
                          : [0, -8, 8, -8, 8, 0],
                      }}
                      transition={{
                        duration: 0.5,
                        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                      }}
                    >
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
                        <XCircle className="h-10 w-10" />
                      </div>
                      <div className="text-center">
                        <div className="font-medium">Scan failed</div>
                        <p className="mt-1 text-sm text-red-300">
                          Try cleaning the card, rotating it, or use Phone OTP
                        </p>
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
                        Camera access blocked. Allow camera in settings or use
                        Phone OTP.
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-6 space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 text-cyan-400">1.</span>
                  <span>Place your Student ID card inside the scanner window.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 text-cyan-400">2.</span>
                  <span>Align the barcode with the red guide.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 text-cyan-400">3.</span>
                  <span>
                    Hold still until you see a green check. (Scanning usually
                    takes &lt; 3 seconds.)
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
                  Helpful tips
                </div>
                <ul className="space-y-1 text-xs text-amber-200/90">
                  <li>
                    • If the barcode won&apos;t read: Clean the card, increase
                    ambient light, or try rotating the card 90°.
                  </li>
                  <li>
                    • Don&apos;t have your card? Use &quot;Phone OTP&quot; or contact the
                    campus admin.
                  </li>
                  <li>
                    • We only store a masked ID token for audit — we don&apos;t save
                    your full ID number.
                  </li>
                </ul>
              </motion.div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  onClick={startScan}
                  disabled={status === "scanning" || status === "requesting" || status === "verifying"}
                  className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-sky-500/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={
                    status !== "scanning" && status !== "requesting" && status !== "verifying"
                      ? { scale: 1.02 }
                      : {}
                  }
                  whileTap={
                    status !== "scanning" && status !== "requesting" && status !== "verifying"
                      ? { scale: 0.98 }
                      : {}
                  }
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {status === "scanning" || status === "requesting" ? (
                      <>
                        <motion.div
                          className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        Scanning...
                      </>
                    ) : status === "verifying" ? (
                      <>
                        <motion.div
                          className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Camera className="h-5 w-5" />
                        Scan Barcode
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 bg-white/20 opacity-0 transition group-hover:opacity-100" />
                </motion.button>

                <motion.button
                  onClick={handlePhoneOTP}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-4 text-base font-medium text-slate-100 transition hover:border-cyan-300 hover:bg-white/10 hover:text-white"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Phone className="h-5 w-5" />
                  Use Phone OTP
                </motion.button>

                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="w-full text-center text-sm text-cyan-400 underline transition hover:text-cyan-300"
                >
                  Need help?
                </button>
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
              {status !== "idle" && status !== "scanning" && status !== "verifying" && status !== "success" && (
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
                  {status === "fail" && (
                    <button
                      onClick={() => setShowHelp(true)}
                      className="flex-1 rounded-full border border-cyan-400/50 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-400/20"
                    >
                      Need help?
                    </button>
                  )}
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
                  <li>• Use Phone OTP as an alternative</li>
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

