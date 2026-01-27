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
  { name: "Bandage", icon: Bandage },
  { name: "Cotton", icon: Bandage },
  { name: "Antiseptic", icon: Pill },
  { name: "Pain Relief Tablet", icon: Pill },
];

// ... imports ...

export default function DashboardPage() {
  const prefersReducedMotion = useReducedMotion();
  const [studentName, setStudentName] = useState("Student");
  const [isLoadingName, setIsLoadingName] = useState(true);
  const [nameError, setNameError] = useState("");

  const dashboardSections = [
    {
      title: "Get AI Health Assistance",
      description: "Scan a symptom or wound and describe how you're feeling. Our AI will guide you with safe first-aid steps and suggested items.",
      icon: Stethoscope,
      buttonText: "Start Health Analysis",
      href: "/en/health-analysis",
      accent: "from-cyan-400/80 to-blue-500/60",
      gradient: "from-cyan-500/20 to-blue-500/20",
    },
    {
      title: "Quick Buy",
      description: "Need something simple and fast? Bandages, cotton, antiseptic, pain relief tablet, or any available first-aid item.",
      icon: ShoppingCart,
      buttonText: "Buy Directly",
      href: "/en/quick-buy",
      accent: "from-emerald-400/80 to-teal-500/60",
      gradient: "from-emerald-500/20 to-teal-500/20",
    },
    {
      title: "Receipts & History",
      description: "View your past visits, receipts, and items you purchased. (Only minimal masked data is stored.)",
      icon: Receipt,
      buttonText: "View My Records",
      href: "/en/history",
      accent: "from-amber-400/80 to-orange-500/60",
      gradient: "from-amber-500/20 to-orange-500/20",
    },
    {
      title: "Account & Settings",
      description: "Update your contact number, preferred language, and notifications. Also view privacy policy and usage limits.",
      icon: Settings,
      buttonText: "Settings",
      href: "/en/settings",
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
          setStudentName(parsed.name || "Student");
        } catch (e) {
          setStudentName("Student");
        }
      } else {
        setStudentName("Student");
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
                Welcome, {isLoadingName ? "..." : studentName || "Student"}!
              </h1>
              <p className="text-sm text-slate-400">You&apos;re signed in</p>
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
              You&apos;re now signed in and ready to use the Smart Health Assistance Machine.
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Choose what you want to do:
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
                  {section.title === "Quick Buy" && (
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
                        <span>+ More items</span>
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
                This machine offers basic first aid only. For serious cases, you&apos;ll be directed to the nearest medical center.
              </p>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-cyan-400" />
                <p>
                  Your identity is protected — we only store a secure student token.
                </p>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
