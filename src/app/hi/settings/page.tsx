"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<{ fullName: string; uid: string; number: string; age: number | null; allergy: string | null } | null>(null);

    const [smsAlerts, setSmsAlerts] = useState(true);
    const [emailReceipts, setEmailReceipts] = useState(true);
    const [monthlySummary, setMonthlySummary] = useState(false);
    const [emergencyAlerts, setEmergencyAlerts] = useState(true);

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

    function handleLogout() {
        if (confirm("क्या आप निश्चित रूप से लॉग आउट करना चाहते हैं?")) {
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
                        href="/hi/dashboard"
                        className="mb-4 inline-flex items-center gap-2 text-slate-300 transition hover:text-cyan-300"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>वापस जाएं</span>
                    </Link>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                            सेटिंग्स और प्राथमिकताएं
                        </h1>
                        <p className="text-lg text-slate-300">
                            अपनी प्रोफ़ाइल और ऐप सेटिंग्स प्रबंधित करें
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
                            <h2 className="text-xl font-semibold text-white">प्रोफ़ाइल विवरण</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                <div className="mb-2 text-sm text-slate-400">नाम</div>
                                <div className="text-lg font-semibold text-white">{profile?.fullName || "लोड हो रहा है..."}</div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                <div className="mb-2 text-sm text-slate-400">छात्र आईडी</div>
                                <div className="text-lg font-semibold text-white">{profile?.uid || "लोड हो रहा है..."}</div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                <div className="mb-2 text-sm text-slate-400">पंजीकृत मोबाइल नंबर</div>
                                <div className="text-lg font-semibold text-white">{profile?.number || "लोड हो रहा है..."}</div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                <div className="mb-2 text-sm text-slate-400">सत्यापित किया गया</div>
                                <div className="text-lg font-semibold text-white">22 Nov 2025, 3:42 PM</div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                <div className="mb-2 text-sm text-slate-400">उम्र</div>
                                <div className="text-lg font-semibold text-white">{profile?.age || "लोड हो रहा है..."}</div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                <div className="mb-2 text-sm text-slate-400">एलर्जी</div>
                                <div className="text-lg font-semibold text-white">{profile?.allergy || "कोई नहीं"}</div>
                            </div>

                            <div className="flex gap-3">
                                <motion.button
                                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-3 font-medium text-slate-300 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Phone className="h-4 w-4" />
                                    फोन अपडेट करें
                                </motion.button>
                                <motion.button
                                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-3 font-medium text-slate-300 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    जानकारी रिफ्रेश करें
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
                            <h2 className="text-xl font-semibold text-white">भाषा और पहुंच</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    पसंदीदा भाषा
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    <motion.button
                                        onClick={() => router.push("/en/settings")}
                                        className="rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        English
                                    </motion.button>
                                    <motion.button
                                        className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-900 transition"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Hindi
                                    </motion.button>
                                    <motion.button
                                        className="rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Regional
                                    </motion.button>
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
                                <h2 className="text-xl font-semibold text-white">सूचनाएं</h2>
                                <p className="text-sm text-slate-400">
                                    चुनें कि आप कैसे अपडेट प्राप्त करना चाहते हैं
                                </p>
                            </div>
                        </div>

                        <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                            <ul className="space-y-1 text-sm text-amber-200">
                                <li>• आपातकालीन अलर्ट हमेशा चालू रहते हैं।</li>
                                <li>• रसीदें आपके पंजीकृत ईमेल पर भेजी जाएंगी।</li>
                                <li>• स्टॉक अपडेट केवल पसंदीदा आइटम के लिए हैं।</li>
                                <li>• मासिक सारांश हर महीने की 1 तारीख को भेजा जाता है।</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-slate-400" />
                                    <span className="text-sm font-medium text-slate-300">SMS अलर्ट</span>
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
                                    <span className="text-sm font-medium text-slate-300">ईमेल रसीदें</span>
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
                                    <span className="text-sm font-medium text-slate-300">मासिक सारांश</span>
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
                                    <span className="text-sm font-medium text-slate-300">आपातकालीन अलर्ट</span>
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
                            <h2 className="text-xl font-semibold text-white">गोपनीयता और सुरक्षा</h2>
                        </div>

                        <div className="mb-4 space-y-2 text-sm text-slate-300">
                            <p>• आपका डेटा एन्क्रिप्टेड है।</p>
                            <p>• हम आपका डेटा किसी के साथ साझा नहीं करते हैं।</p>
                            <p>• आप किसी भी समय अपना डेटा हटा सकते हैं।</p>
                            <p>• सभी लेनदेन सुरक्षित हैं।</p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <motion.button
                                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-3 font-medium text-slate-300 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Eye className="h-4 w-4" />
                                डेटा देखें
                            </motion.button>
                            <motion.button
                                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-3 font-medium text-red-300 transition hover:border-red-500 hover:bg-red-500/20"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Trash2 className="h-4 w-4" />
                                लॉग हटाएं
                            </motion.button>
                            <motion.button
                                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-3 font-medium text-slate-300 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FileText className="h-4 w-4" />
                                गोपनीयता नीति
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
                            <h2 className="text-xl font-semibold text-white">बिलिंग और भुगतान</h2>
                        </div>

                        <div className="space-y-4">

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <motion.button
                                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-3 font-medium text-slate-300 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FileText className="h-4 w-4" />
                                    भुगतान इतिहास
                                </motion.button>
                                <motion.button
                                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-3 font-medium text-slate-300 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Download className="h-4 w-4" />
                                    चालान डाउनलोड करें
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
                            <h2 className="text-xl font-semibold text-white">सहायता और समर्थन</h2>
                        </div>

                        <div className="space-y-3">
                            {[
                                "अक्सर पूछे जाने वाले प्रश्न (FAQ)",
                                "आपातकालीन संपर्क नंबर",
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
                                सहायता प्राप्त करें
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
                                <h2 className="text-xl font-semibold text-white">लॉग आउट करें</h2>
                                <p className="text-sm text-slate-400">
                                    अपने खाते से सुरक्षित रूप से साइन आउट करें
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
                                लॉग आउट
                            </div>
                        </motion.button>
                    </div>
                </motion.section>
            </div>
        </div>
    );
}
