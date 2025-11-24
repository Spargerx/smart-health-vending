"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Bandage,
  Bot,
  Camera,
  Fingerprint,
  HeartPulse,
  Pill,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Syringe,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ShoppingCart,
  LogOut,
} from "lucide-react";

const actions = [
  {
    title: "Authenticate Yourself",
    description: "Verify via Aadhaar, Student ID, or a secure phone OTP.",
    icon: Fingerprint,
    accent: "from-sky-400/80 to-cyan-300/60",
  },
  {
    title: "Scan or Describe",
    description: "Capture the wound or type what you feel for instant context.",
    icon: Camera,
    accent: "from-purple-400/80 to-indigo-400/60",
  },
  {
    title: "AI-Assisted Guidance",
    description: "Co-pilot nurses and doctors offer step-by-step first-aid.",
    icon: Bot,
    accent: "from-emerald-400/80 to-teal-300/60",
  },
  {
    title: "See Medicines",
    description: "Unlock tailored medicine suggestions after the ₹10 fee.",
    icon: Pill,
    accent: "from-rose-400/80 to-orange-300/60",
  },
  {
    title: "Digital or Printed Receipt",
    description: "Keep a record of care instructions anywhere you go.",
    icon: ReceiptText,
    accent: "from-amber-400/80 to-yellow-300/50",
  },
  {
    title: "Buy Essentials Instantly",
    description: "Grab bandages, cotton, antiseptic gel, and more on the spot.",
    icon: Syringe,
    accent: "from-cyan-400/80 to-blue-300/60",
  },
];

const quickSteps = [
  {
    title: "Describe or Scan",
    detail: "A wound photo + short note boosts diagnostic accuracy.",
  },
  {
    title: "AI + Clinician Review",
    detail: "Smart triage syncs with nurses and on-call doctors.",
  },
  {
    title: "Guided First-Aid",
    detail: "Simple language, animations, and haptic cues walk you through.",
  },
  {
    title: "Next Best Step",
    detail: "Severe cases? We route you to the nearest doctor or hospital.",
  },
];

const previewSteps = [
  {
    id: 1,
    title: "Authenticate Yourself",
    description: "Scan your Student ID barcode or use Phone OTP to verify your identity securely.",
    icon: Fingerprint,
    details: "Quick verification process that takes less than 3 seconds. Your identity is protected with masked tokens.",
  },
  {
    id: 2,
    title: "AI Health Analysis",
    description: "Upload a photo or describe your symptoms. Our AI analyzes and provides safe first-aid guidance.",
    icon: Bot,
    details: "The AI works with doctors and nurses to give you step-by-step first-aid instructions tailored to your needs.",
  },
  {
    id: 3,
    title: "Upload or Scan Symptoms",
    description: "Capture the affected area with the machine camera or upload from your phone.",
    icon: Camera,
    details: "Clear photos help the AI understand your condition better and provide more accurate recommendations.",
  },
  {
    id: 4,
    title: "View Recommendations",
    description: "See AI-assisted first-aid suggestions, severity levels, and recommended items.",
    icon: Stethoscope,
    details: "Get personalized guidance with confidence indicators and safety alerts for severe cases.",
  },
  {
    id: 5,
    title: "Purchase Items Directly",
    description: "Buy essential first-aid items like bandages, antiseptic, pain relief, and more instantly.",
    icon: ShoppingCart,
    details: "No waiting, no analysis needed. Quick buy option for immediate access to essential items.",
  },
  {
    id: 6,
    title: "Receipt Generation",
    description: "Digital receipts are automatically generated and sent to your registered phone number.",
    icon: ReceiptText,
    details: "Keep a record of your purchases and care instructions. Download or print anytime.",
  },
  {
    id: 7,
    title: "Safe Logout",
    description: "Automatically logged out after inactivity for your security and privacy.",
    icon: LogOut,
    details: "Your session is secure. All data is protected with masked student tokens only.",
  },
];

export default function Home() {
  const [showPreview, setShowPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

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
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="orbital-gradient" aria-hidden />
      <div className="grid-overlay" aria-hidden />

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-4 pt-16 sm:px-8 lg:flex-row lg:items-center">
        <motion.section
          className="flex-1 space-y-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.span
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-sm text-cyan-100 shadow-lg shadow-cyan-500/20 backdrop-blur"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="h-4 w-4 text-cyan-300" />
            Welcome to the Smart Health Assistance Vending Machine!
          </motion.span>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
              Your instant first-aid partner for everyday health concerns.
          </h1>
            <p className="max-w-2xl text-xl text-slate-200">
              This machine works <span className="text-cyan-300">with</span>{" "}
              doctors and nurses—never instead of them—to deliver quick, safe,
              and guided care the moment you need it.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {["Futuristic triage flow", "Human + AI co-pilot safety"].map(
              (item, index) => (
                <motion.div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 backdrop-blur"
                  whileHover={{ y: -6, borderColor: "rgba(103,232,249,0.8)" }}
                  transition={{ type: "spring", stiffness: 200, delay: index * 0.05 }}
                >
                  {item}
                </motion.div>
              ),
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/auth">
              <motion.button
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 px-8 py-3 text-base font-semibold shadow-lg shadow-sky-500/40 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Tap &quot;Get Started&quot;
                  <HeartPulse className="h-4 w-4 transition group-hover:scale-110" />
                </span>
                <span className="absolute inset-0 bg-white/20 opacity-0 transition group-hover:opacity-100" />
              </motion.button>
            </Link>

            <motion.button
              onClick={() => setShowPreview(true)}
              className="rounded-full border border-white/30 px-6 py-3 text-base font-medium text-slate-100 transition hover:border-cyan-300 hover:text-white"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Preview the Flow
            </motion.button>
          </div>

          <p className="text-sm text-slate-300">
            Tap “Get Started” to continue.
          </p>
        </motion.section>

        <motion.section
          className="floating flex-1"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <div className="frosted-card relative overflow-hidden rounded-[32px] p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/30 blur-3xl" />
            <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-slate-300">
              <ShieldCheck className="h-5 w-5 text-cyan-300" />
              Guided triage preview
            </div>

            <div className="mt-6 space-y-4">
              {quickSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-indigo-500/40 text-lg font-semibold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-base font-semibold text-white">
                        {step.title}
                      </p>
                      <p className="text-sm text-slate-300">{step.detail}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-5 py-4 text-sm text-cyan-100">
              Works alongside certified medical teams so you’re never alone in
              urgent moments.
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-slate-200">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Guidance fee
                </p>
                <p className="text-4xl font-semibold text-white">₹10</p>
              </div>
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
              <div className="max-w-xs text-sm text-slate-300">
                Unlock the recommendation deck with digital, human-reviewed
                insights and ready-to-buy essentials.
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-cyan-200">
              One touch, total clarity
            </p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              What you can do here
            </h2>
          </div>
          <p className="max-w-xl text-base text-slate-300">
            Your instant first-aid partner for everyday health concerns—guided
            by clinicians and powered by AI.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {actions.map(({ title, description, icon: Icon, accent }) => (
            <motion.div
              key={title}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-300/60"
              whileHover={{ y: -6 }}
            >
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent}`}
              >
                <Icon className="h-5 w-5 text-slate-900 drop-shadow" />
              </div>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="mt-2 text-slate-300">{description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <motion.div
            className="frosted-card rounded-3xl p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 text-sm uppercase tracking-[0.4em] text-cyan-200">
              <Stethoscope className="h-5 w-5 text-cyan-300" />
              For your safety
            </div>
            <p className="mt-4 text-lg text-slate-100">
              This machine provides basic first-aid only. Severe cases are
              instantly guided to a nearby doctor or hospital.
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Every recommendation is double-checked by remote medical experts.
            </p>
          </motion.div>

          <motion.div
            className="rounded-3xl border border-white/10 bg-white/5 p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="flex items-center gap-3 text-sm uppercase tracking-[0.4em] text-cyan-200">
              <Bandage className="h-5 w-5 text-cyan-300" />
              Essentials kiosk
            </div>
            <p className="mt-4 text-lg text-slate-100">
              Buy standalone items whenever you need them.
            </p>
            <ul className="mt-4 space-y-2 text-slate-300">
              {[
                "Medical-grade bandages and sterile cotton",
                "Antiseptic wipes, gels, and sprays",
                "Reusable cold packs and skin-safe tapes",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-cyan-300" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

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
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Want to see how this machine works?</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Get a quick walkthrough before you begin
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
                          Step {previewSteps[currentStep].id}
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
                  Previous
                </motion.button>

                <div className="flex gap-2">
                  {previewSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`h-2 rounded-full transition ${
                        index === currentStep
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
                    Next
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
                    Got It!
                  </motion.button>
                )}
              </div>

              {/* Footer Note */}
              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="text-center text-xs text-slate-400">
                  <ShieldCheck className="mr-1 inline h-3 w-3" />
                  Your data is never shared during the preview. This is only a demonstration.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
