"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
  ArrowLeft,
  User,
  Globe,
  Bell,
  Shield,
  CreditCard,
  HelpCircle,
  LogOut,
  Phone,
  RefreshCw,
  Eye,
  Trash2,
  FileText,
  Download,
  Mail,
  MessageSquare,
  AlertTriangle,
  Edit,
  Save,
  X as XIcon,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const [profile, setProfile] = useState<{ fullName: string; uid: string; number: string; age: number | null; allergy: string | null } | null>(null);

  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailReceipts, setEmailReceipts] = useState(true);
  const [monthlySummary, setMonthlySummary] = useState(false);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<{ age: string; allergy: string; number: string }>({ age: "", allergy: "", number: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const uid = sessionStorage.getItem("studentId");
    if (uid) {
      fetch(`/api/student-profile?uid=${encodeURIComponent(uid)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProfile({
              fullName: data.fullName,
              uid: data.uid,
              number: data.number,
              age: data.age,
              allergy: data.allergy
            });
          }
        })
        .catch((err) => console.error("Failed to fetch profile", err));
    }
  }, []);

  function handleEdit() {
    if (profile) {
      setEditedProfile({
        age: profile.age?.toString() || "",
        allergy: profile.allergy || "",
        number: profile.number || "",
      });
      setIsEditing(true);
      setSuccessMessage("");
    }
  }

  function handleCancel() {
    setIsEditing(false);
    setEditedProfile({ age: "", allergy: "", number: "" });
    setSuccessMessage("");
  }

  async function handleSave() {
    if (!profile) return;

    // Validate age
    if (editedProfile.age && (isNaN(Number(editedProfile.age)) || Number(editedProfile.age) < 1)) {
      alert("Please enter a valid age");
      return;
    }

    setIsSaving(true);
    setSuccessMessage("");

    try {
      const response = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: profile.uid,
          age: editedProfile.age ? Number(editedProfile.age) : null,
          allergy: editedProfile.allergy || null,
          number: editedProfile.number || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local profile state
        setProfile({
          ...profile,
          age: editedProfile.age ? Number(editedProfile.age) : null,
          allergy: editedProfile.allergy || null,
          number: editedProfile.number || null,
        });
        setIsEditing(false);
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating your profile");
    } finally {
      setIsSaving(false);
    }
  }

  function handleLogout() {
    if (confirm("Are you sure you want to log out?")) {
      // Clear session
      sessionStorage.clear();
      // Navigate to home or auth page
      window.location.href = "/";
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="orbital-gradient" aria-hidden />
      <div className="grid-overlay" aria-hidden />

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
            <span>Back to Dashboard</span>
          </Link>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              {"Manage Your Profile & Preferences"}
            </h1>
            <p className="text-lg text-slate-300">
              {"Customize your experience, update your information, and control how the Health Assistance Machine interacts with you."}
            </p>
          </div>
        </motion.header>

        {/* Profile Section */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="frosted-card rounded-3xl border border-white/10 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500">
                <User className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white"> {"Your Profile"}</h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 text-sm text-slate-400">{"Name"}</div>
                <div className="text-lg font-semibold text-white">{profile?.fullName || "Loading..."}</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 text-sm text-slate-400">{"Student ID"}</div>
                <div className="text-lg font-semibold text-white">{profile?.uid || "Loading..."}</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 text-sm text-slate-400">{"Phone Number"}</div>
                <div className="text-lg font-semibold text-white">
                  {profile?.number ? profile.number : profile ? "Not Registered" : "Loading..."}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 text-sm text-slate-400">{"Age"}</div>
                <div className="text-lg font-semibold text-white">{profile?.age || "Loading..."}</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 text-sm text-slate-400">{"Allergy"}</div>
                <div className="text-lg font-semibold text-white">{profile?.allergy || "None"}</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 text-sm text-slate-400">{"Verified On"}</div>
                <div className="text-lg font-semibold text-white">{new Date().toLocaleString('en-US')}</div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-3 font-medium text-slate-300 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Phone className="h-4 w-4" />
                  {"Update Phone Number"}
                </motion.button>
                <motion.button
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-3 font-medium text-slate-300 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RefreshCw className="h-4 w-4" />
                  {"Refresh Student Info"}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Language & Accessibility */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="frosted-card rounded-3xl border border-white/10 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">🌐 {"Language & Accessibility"}</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  {"Preferred Language"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {(["English", "Hindi"] as const).map((lang) => (
                    <motion.button
                      key={lang}
                      onClick={() => {
                        if (lang === "Hindi") {
                          router.push("/hi/settings");
                        }
                        setLanguage(lang);
                      }}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${language === lang
                        ? "bg-cyan-400 text-slate-900"
                        : "bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {lang}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Notifications & Alerts */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="frosted-card rounded-3xl border border-white/10 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">🔔 {"Notifications & Alerts"}</h2>
                <p className="text-sm text-slate-400">
                  {"Based on your previous usage, we can notify you about:"}
                </p>
              </div>
            </div>

            <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
              <ul className="space-y-1 text-sm text-amber-200">
                <li>• {"Receipt deliveries"}</li>
                <li>• {"Low-stock alerts for frequently purchased items"}</li>
                <li>• {"Health tips based on seasonal changes"}</li>
                <li>• {"High-fever or severe-symptom safety warnings"}</li>
              </ul>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">{"SMS Alerts"}</span>
                </div>
                <button
                  onClick={() => setSmsAlerts(!smsAlerts)}
                  className={`relative h-6 w-11 rounded-full transition ${smsAlerts ? "bg-cyan-400" : "bg-white/20"
                    }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition ${smsAlerts ? "translate-x-5" : ""
                      }`}
                  />
                </button>
              </label>

              <label className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">{"Email Receipts"}</span>
                </div>
                <button
                  onClick={() => setEmailReceipts(!emailReceipts)}
                  className={`relative h-6 w-11 rounded-full transition ${emailReceipts ? "bg-cyan-400" : "bg-white/20"
                    }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition ${emailReceipts ? "translate-x-5" : ""
                      }`}
                  />
                </button>
              </label>

              <label className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">{"Monthly Usage Summary"}</span>
                </div>
                <button
                  onClick={() => setMonthlySummary(!monthlySummary)}
                  className={`relative h-6 w-11 rounded-full transition ${monthlySummary ? "bg-cyan-400" : "bg-white/20"
                    }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition ${monthlySummary ? "translate-x-5" : ""
                      }`}
                  />
                </button>
              </label>

              <label className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">{"Emergency Alerts"}</span>
                </div>
                <button
                  onClick={() => setEmergencyAlerts(!emergencyAlerts)}
                  className={`relative h-6 w-11 rounded-full transition ${emergencyAlerts ? "bg-cyan-400" : "bg-white/20"
                    }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition ${emergencyAlerts ? "translate-x-5" : ""
                      }`}
                  />
                </button>
              </label>
            </div>
          </div>
        </motion.section>

        {/* Privacy & Security */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="frosted-card rounded-3xl border border-white/10 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-400 to-rose-500">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">🔐 {"Privacy & Security"}</h2>
            </div>

            <div className="mb-4 space-y-2 text-sm text-slate-300">
              <p>• {"We protect your identity using secure student tokens."}</p>
              <p>• {"No personal medical records are stored"}</p>
              <p>• {"Only masked identity logs are kept for audit safety"}</p>
              <p>• {"You can delete your usage logs anytime"}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <motion.button
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-3 font-medium text-slate-300 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Eye className="h-4 w-4" />
                {"View My Data"}
              </motion.button>
              <motion.button
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-3 font-medium text-red-300 transition hover:border-red-500 hover:bg-red-500/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Trash2 className="h-4 w-4" />
                {"Delete My Logs"}
              </motion.button>
              <motion.button
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-3 font-medium text-slate-300 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FileText className="h-4 w-4" />
                {"Privacy Policy"}
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Billing & Payments */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="frosted-card rounded-3xl border border-white/10 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">🧾 {"Billing & Payments"}</h2>
            </div>

            <div className="space-y-4">

              <div className="flex flex-col gap-3 sm:flex-row">
                <motion.button
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-3 font-medium text-slate-300 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FileText className="h-4 w-4" />
                  {"Transaction History"}
                </motion.button>
                <motion.button
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-3 font-medium text-slate-300 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="h-4 w-4" />
                  {"Download Payment Summary"}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Support & Helpdesk */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="frosted-card rounded-3xl border border-white/10 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500">
                <HelpCircle className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">💬 {"Support & Helpdesk"}</h2>
            </div>

            <div className="space-y-3">
              {[
                "Frequently Asked Questions",
                "Emergency Medical Contact",
              ].map((item) => (
                <motion.button
                  key={item}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left font-medium text-slate-300 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item}
                </motion.button>
              ))}

              <motion.button
                className="w-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-3 font-semibold text-white shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {"Get Help Now"}
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Logout Section */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <div className="frosted-card rounded-3xl border border-white/10 p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-400 to-rose-500">
                <LogOut className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">🔄 {"Logout Section"}</h2>
                <p className="text-sm text-slate-400">
                  {"For security, you're auto-logged out after inactivity."}
                </p>
              </div>
            </div>

            <motion.button
              onClick={handleLogout}
              className="w-full rounded-full border-2 border-red-500/50 bg-red-500/10 px-6 py-4 font-semibold text-red-300 transition hover:border-red-500 hover:bg-red-500/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center gap-2">
                <LogOut className="h-5 w-5" />
                {"Log Out Securely"}
              </div>
            </motion.button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
