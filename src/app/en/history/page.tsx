"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Receipt,
  Download,
  Printer,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  Shield,
  Package,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";


interface Activity {
  id: string;
  date: string;
  time: string;
  type: "purchase" | "analysis";
  description: string;
  items?: string[];
  amount?: number;
}

interface Receipt {
  id: string;
  receiptId: string;
  date: string;
  items: { name: string; quantity: number; price: number }[];
  status: "Completed" | "Pending" | "Cancelled";
  paymentMethod: "UPI" | "Card" | "Cash";
  sentTo: string;
  total: number;
}

const recentActivities: Activity[] = [
  {
    id: "act1",
    date: "Today",
    time: "3:42 PM",
    type: "purchase",
    description: "history.act.wipes",
    amount: 8,
  },
  {
    id: "act2",
    date: "Yesterday",
    time: "11:10 AM",
    type: "purchase",
    description: "history.act.fever",
    amount: 5,
  },
  {
    id: "act3",
    date: "2 Days Ago",
    time: "",
    type: "analysis",
    description: "history.act.analysis",
    items: ["history.item.bandage", "history.item.antiseptic", "history.item.cotton"],
  },
  {
    id: "act4",
    date: "Last Week",
    time: "",
    type: "purchase",
    description: "history.act.bandage",
    amount: 10,
  },
];

const receipts: Receipt[] = [
  {
    id: "rec1",
    receiptId: "RX-54G82",
    date: "22 Nov 2025",
    items: [
      { name: "history.item.bandage", quantity: 1, price: 10 },
      { name: "history.item.roll", quantity: 1, price: 5 },
    ],
    status: "Completed",
    paymentMethod: "UPI",
    sentTo: "+91 •••• 7821",
    total: 15,
  },
  {
    id: "rec2",
    receiptId: "RX-52F91",
    date: "20 Nov 2025",
    items: [{ name: "history.item.fever", quantity: 1, price: 5 }],
    status: "Completed",
    paymentMethod: "Card",
    sentTo: "+91 •••• 7821",
    total: 5,
  },
  {
    id: "rec3",
    receiptId: "RX-51E80",
    date: "18 Nov 2025",
    items: [
      { name: "history.item.wipes", quantity: 2, price: 8 },
      { name: "history.item.pack", quantity: 1, price: 10 },
    ],
    status: "Completed",
    paymentMethod: "UPI",
    sentTo: "+91 •••• 7821",
    total: 26,
  },
];

const insights = [
  "history.insight.1",
  "history.insight.2",
  "history.insight.3",
  "history.insight.4",
];

export default function HistoryPage() {

  const [expandedReceipt, setExpandedReceipt] = useState<string | null>(null);
  const [showMoreInsights, setShowMoreInsights] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<"All" | "Today" | "Week" | "Month">("All");
  const [categoryFilter, setCategoryFilter] = useState<
    "All" | "Medicine" | "First-Aid" | "Hygiene" | "AI-Advice"
  >("All");
  const [showFilters, setShowFilters] = useState(false);

  function handleDownloadReceipt(receiptId: string) {
    alert(`Downloading receipt: ${receiptId}`);
  }

  function handlePrintReceipt() {
    window.print();
  }

  function handleDownloadHistory() {
    alert("Downloading your complete history...");
  }

  const filteredReceipts = receipts.filter((receipt) => {
    if (searchQuery) {
      const matchesSearch =
        receipt.receiptId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        receipt.items.some((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        receipt.date.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
    }

    // Date filter logic would go here (simplified for demo)
    if (dateFilter !== "All") {
      // In real implementation, filter by actual dates
    }

    return true;
  });

  const getDateFilterLabel = (filter: string) => {
    switch (filter) {
      case "All": return "All";
      case "Today": return "Today";
      case "Week": return "Week";
      case "Month": return "Month";
      default: return filter;
    }
  };

  const getCategoryFilterLabel = (filter: string) => {
    switch (filter) {
      case "All": return "All";
      case "Medicine": return "Medicine";
      case "First-Aid": return "First Aid";
      case "Hygiene": return "Hygiene";
      case "AI-Advice": return "AI-Advice";
      default: return filter;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="orbital-gradient" aria-hidden />
      <div className="grid-overlay" aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
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
              {"Your Usage History"}
            </h1>
            <p className="text-lg text-slate-300">
              {"View your recent visits, receipts, and items you purchased from this Health Assistance Machine."}
            </p>
          </div>
        </motion.header>

        {/* Search & Filter */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="frosted-card rounded-3xl border border-white/10 p-6">
            <div className="mb-4 flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={"Search: item name, month, or receipt ID"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-10 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Filter className="h-5 w-5" />
                <span>{"Filter"}</span>
                {showFilters ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </motion.button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  className="space-y-4 border-t border-white/10 pt-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      {"Filter by Date"}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(["All", "Today", "Week", "Month"] as const).map((filter) => (
                        <motion.button
                          key={filter}
                          onClick={() => setDateFilter(filter)}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition ${dateFilter === filter
                            ? "bg-cyan-400 text-slate-900"
                            : "bg-white/5 text-slate-300 hover:bg-white/10"
                            }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {getDateFilterLabel(filter)}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      {"Filter by Category"}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(["All", "Medicine", "First-Aid", "Hygiene", "AI-Advice"] as const).map(
                        (filter) => (
                          <motion.button
                            key={filter}
                            onClick={() => setCategoryFilter(filter)}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${categoryFilter === filter
                              ? "bg-cyan-400 text-slate-900"
                              : "bg-white/5 text-slate-300 hover:bg-white/10"
                              }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {getCategoryFilterLabel(filter)}
                          </motion.button>
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Recent Activity */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="frosted-card rounded-3xl border border-white/10 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">🔄 {"Recent Activity"}</h2>
                <p className="text-sm text-slate-400">{"Auto-updates every time you use the machine"}</p>
              </div>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-400/20">
                    {activity.type === "purchase" ? (
                      <Package className="h-5 w-5 text-cyan-400" />
                    ) : (
                      <Sparkles className="h-5 w-5 text-purple-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="font-medium">{activity.date}</span>
                      {activity.time && <span>• {activity.time}</span>}
                    </div>
                    <p className="mt-1 font-medium text-white">{activity.description}</p>
                    {activity.amount && (
                      <p className="mt-1 text-sm text-cyan-400">₹{activity.amount}</p>
                    )}
                    {activity.items && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {activity.items.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-purple-400/20 px-3 py-1 text-xs text-purple-300"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              className="mt-6 w-full rounded-full border border-white/20 bg-white/5 px-6 py-3 font-medium text-slate-300 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {"View Full Timeline"}
            </motion.button>
          </div>
        </motion.section>

        {/* Digital Receipts */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="frosted-card rounded-3xl border border-white/10 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500">
                <Receipt className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">🧾 {"Your Digital Receipts"}</h2>
                <p className="text-sm text-slate-400">
                  {"Auto-generated and securely stored (masked identity)"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {filteredReceipts.map((receipt, index) => (
                <motion.div
                  key={receipt.id}
                  className="overflow-hidden rounded-xl border border-white/10 bg-white/5 transition hover:border-cyan-300/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                >
                  <button
                    onClick={() =>
                      setExpandedReceipt(expandedReceipt === receipt.id ? null : receipt.id)
                    }
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-white">{"Receipt"} {receipt.receiptId}</h3>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${receipt.status === "Completed"
                              ? "bg-green-500/20 text-green-400"
                              : receipt.status === "Pending"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                              }`}
                          >
                            {receipt.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-400">{receipt.date}</p>
                        <p className="mt-1 text-sm text-cyan-400">{"Total"}: ₹{receipt.total}</p>
                      </div>
                      {expandedReceipt === receipt.id ? (
                        <ChevronUp className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedReceipt === receipt.id && (
                      <motion.div
                        className="border-t border-white/10 p-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="space-y-4">
                          <div>
                            <h4 className="mb-2 text-sm font-medium text-slate-300">{"Items:"}</h4>
                            <div className="space-y-2">
                              {receipt.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
                                >
                                  <span className="text-sm text-white">
                                    {item.quantity}× {item.name}
                                  </span>
                                  <span className="text-sm font-semibold text-cyan-400">
                                    ₹{item.price}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-400">{"Payment:"}</span>
                              <p className="font-medium text-white">{receipt.paymentMethod}</p>
                            </div>
                            <div>
                              <span className="text-slate-400">{"Sent to:"}</span>
                              <p className="font-medium text-white">{receipt.sentTo}</p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadReceipt(receipt.receiptId);
                              }}
                              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Download className="h-4 w-4" />
                              {"Download"}
                            </motion.button>
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePrintReceipt();
                              }}
                              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Printer className="h-4 w-4" />
                              {"Print Copy"}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Smart Insights */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="frosted-card rounded-3xl border border-white/10 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">📌 {"Smart Insights"}</h2>
                <p className="text-sm text-slate-400">
                  {"AI-generated, personalized based on your usage"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {insights.slice(0, showMoreInsights ? insights.length : 2).map((insight, index) => (
                <motion.div
                  key={index}
                  className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                >
                  <p className="text-slate-200">{insight}</p>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={() => setShowMoreInsights(!showMoreInsights)}
              className="mt-4 w-full rounded-full border border-white/20 bg-white/5 px-6 py-3 font-medium text-slate-300 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {showMoreInsights ? "Show Less Insights" : "Show More Insights"}
            </motion.button>
          </div>
        </motion.section>

        {/* Download Full Log */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="frosted-card rounded-3xl border border-white/10 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">🗂 {"Download Your Full Log"}</h2>
                <p className="text-sm text-slate-400">
                  {"Export your entire usage history for records or documentation"}
                </p>
              </div>
            </div>

            <motion.button
              onClick={handleDownloadHistory}
              className="w-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 font-semibold text-white shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center gap-2">
                <Download className="h-5 w-5" />
                {"Download My History (PDF)"}
              </div>
            </motion.button>
            <p className="mt-2 text-center text-xs text-slate-400">
              {"Generated using your masked student token"}
            </p>
          </div>
        </motion.section>

        {/* Privacy Notes */}
        <motion.footer
          className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 shrink-0 text-cyan-400" />
            <div className="space-y-2">
              <p className="font-medium text-slate-300">🛡 {"Privacy Notes"}</p>
              <p>• {"Only masked Student-ID tokens are stored."}</p>
              <p>• {"No personal medical data is kept - only item purchases and timestamps."}</p>
              <p>• {"You can request deletion of your stored logs anytime."}</p>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}