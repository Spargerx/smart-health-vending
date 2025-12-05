"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Package,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";


interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  stockStatus?: "In Stock" | "Low Stock" | string;
  category: string;
}

const recommendedProducts: Product[] = [
  { id: "rec1", name: "prod.bandage", price: 10, stock: 15, category: "cat.wound" },
  { id: "rec2", name: "prod.cotton", price: 5, stock: 8, stockStatus: "quickbuy.stock.low", category: "cat.wound" },
  { id: "rec3", name: "prod.pain", price: 5, stock: 20, category: "cat.pain" },
  { id: "rec4", name: "prod.wipes", price: 8, stock: 3, stockStatus: "quickbuy.stock.left", category: "cat.wound" },
];

const woundCareProducts: Product[] = [
  { id: "wc1", name: "prod.liquid", price: 25, stock: 12, category: "cat.wound" },
  { id: "wc2", name: "prod.gauze", price: 15, stock: 10, category: "cat.wound" },
  { id: "wc3", name: "prod.tape", price: 12, stock: 5, stockStatus: "quickbuy.stock.low", category: "cat.wound" },
  { id: "wc4", name: "prod.heavy", price: 20, stock: 8, category: "cat.wound" },
  { id: "wc5", name: "prod.burn", price: 30, stock: 6, stockStatus: "quickbuy.stock.low", category: "cat.wound" },
  { id: "wc6", name: "prod.joint", price: 45, stock: 4, stockStatus: "quickbuy.stock.left", category: "cat.wound" },
];

const feverPainProducts: Product[] = [
  { id: "fp1", name: "prod.para", price: 8, stock: 25, category: "cat.pain" },
  { id: "fp2", name: "prod.ibu", price: 10, stock: 20, category: "cat.pain" },
  { id: "fp3", name: "prod.ors", price: 15, stock: 18, category: "cat.pain" },
  { id: "fp4", name: "prod.elec", price: 25, stock: 12, category: "cat.pain" },
  { id: "fp5", name: "prod.spray", price: 35, stock: 7, stockStatus: "quickbuy.stock.low", category: "cat.pain" },
];

const hygieneProducts: Product[] = [
  { id: "hy1", name: "prod.sani", price: 40, stock: 15, category: "cat.hygiene" },
  { id: "hy2", name: "prod.tissues", price: 20, stock: 10, category: "cat.hygiene" },
  { id: "hy3", name: "prod.wetwipes", price: 30, stock: 8, category: "cat.hygiene" },
  { id: "hy4", name: "prod.pads", price: 45, stock: 12, category: "cat.hygiene" },
  { id: "hy5", name: "prod.mask", price: 15, stock: 20, category: "cat.hygiene" },
  { id: "hy6", name: "prod.gloves", price: 25, stock: 9, stockStatus: "quickbuy.stock.low", category: "cat.hygiene" },
];

const seasonalProducts: Product[] = [
  { id: "se1", name: "prod.sun", price: 20, stock: 10, category: "cat.seasonal" },
  { id: "se2", name: "prod.mosq", price: 35, stock: 8, category: "cat.seasonal" },
  { id: "se3", name: "prod.cream", price: 50, stock: 6, stockStatus: "quickbuy.stock.low", category: "cat.seasonal" },
  { id: "se4", name: "prod.balm", price: 25, stock: 12, category: "cat.seasonal" },
];

const bundles = [
  {
    id: "bundle1",
    name: "bundle.kit",
    description: "bundle.desc.kit",
    price: 50,
    originalPrice: 60,
    items: ["prod.bandage", "prod.gauze", "prod.cotton", "prod.liquid"],
    stock: 10,
  },
  {
    id: "bundle2",
    name: "bundle.exam",
    description: "bundle.desc.exam",
    price: 30,
    originalPrice: 40,
    items: ["prod.ors", "prod.para"],
    stock: 15,
  },
  {
    id: "bundle3",
    name: "bundle.sports",
    description: "bundle.desc.sports",
    price: 100,
    originalPrice: 120,
    items: ["prod.joint", "prod.heavy", "prod.spray"],
    stock: 5,
  },
];

export default function QuickBuyPage() {

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Card" | "Cash" | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  function addToCart(product: Product) {
    if (product.stock === 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity < product.stock) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return prev;
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function updateQuantity(id: string, delta: number) {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          if (newQuantity <= 0) return null;
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter((item) => item !== null) as CartItem[]
    );
  }

  function addBundleToCart(bundle: typeof bundles[0]) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === bundle.id);
      if (existing) {
        return prev.map((item) =>
          item.id === bundle.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: bundle.id, name: bundle.name, price: bundle.price, quantity: 1 }];
    });
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function getStockStatus(product: Product): string {
    if (product.stockStatus === "quickbuy.stock.left") {
      return `Only ${product.stock} left`;
    }
    if (product.stockStatus) return product.stockStatus;
    if (product.stock <= 3) return `Only ${product.stock} left`;
    if (product.stock <= 5) return "Low Stock";
    return "In Stock";
  }

  function getStockColor(product: Product): string {
    if (product.stock <= 3) return "text-red-400";
    if (product.stock <= 5) return "text-yellow-400";
    return "text-green-400";
  }

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
          <div className="mb-4 flex items-center justify-between">
            <Link
              href="/en/dashboard"
              className="inline-flex items-center gap-2 text-slate-300 transition hover:text-cyan-300"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>{"Back to Dashboard"}</span>
            </Link>

            <motion.button
              onClick={() => setShowCart(true)}
              className="relative flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-2 transition hover:border-cyan-300 hover:bg-cyan-400/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>{"Cart"}</span>
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400 text-xs font-bold text-slate-900">
                  {cartCount}
                </span>
              )}
            </motion.button>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              {"What do you need right now?"}
            </h1>
            <p className="text-lg text-slate-300">
              {"Choose from essential first-aid items below. No analysis, no wait - just pick and buy."}
            </p>
          </div>
        </motion.header>

        {/* Recommended Section */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="frosted-card rounded-3xl border border-white/10 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">🔥 {"Recommended for You"}</h2>
                <p className="text-sm text-slate-400">{"Based on your past usage and common needs"}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recommendedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-300/50"
                  whileHover={{ y: -4 }}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{product.name}</h3>
                      <p className="text-lg font-bold text-cyan-400">₹{product.price}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <span className={`text-xs ${getStockColor(product)}`}>
                      {getStockStatus(product)}
                    </span>
                  </div>
                  <motion.button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={product.stock > 0 ? { scale: 1.05 } : {}}
                    whileTap={product.stock > 0 ? { scale: 0.95 } : {}}
                  >
                    {"Add to Cart"}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Wound & Injury Care */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="frosted-card rounded-3xl border border-white/10 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-400 to-rose-500">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">🩹 {"Wound & Injury Care"}</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {woundCareProducts.map((product) => (
                <motion.div
                  key={product.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-300/50"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{product.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm font-semibold text-cyan-400">₹{product.price}</span>
                      <span className={`text-xs ${getStockColor(product)}`}>
                        {getStockStatus(product)}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="ml-4 rounded-full bg-cyan-400/20 p-2 text-cyan-400 transition hover:bg-cyan-400/30 disabled:opacity-50"
                    whileHover={product.stock > 0 ? { scale: 1.1 } : {}}
                    whileTap={product.stock > 0 ? { scale: 0.9 } : {}}
                  >
                    <Plus className="h-5 w-5" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Fever & Pain Relief */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="frosted-card rounded-3xl border border-white/10 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">🤒 {"Fever & Pain Relief"}</h2>
            </div>

            <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
              <p className="text-sm text-amber-200">
                <AlertCircle className="mr-2 inline h-4 w-4" />
                {"Serious injury? Use 'Health Assistance' for guided help."}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {feverPainProducts.map((product) => (
                <motion.div
                  key={product.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-300/50"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{product.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm font-semibold text-cyan-400">₹{product.price}</span>
                      <span className={`text-xs ${getStockColor(product)}`}>
                        {getStockStatus(product)}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="ml-4 rounded-full bg-cyan-400/20 p-2 text-cyan-400 transition hover:bg-cyan-400/30 disabled:opacity-50"
                    whileHover={product.stock > 0 ? { scale: 1.1 } : {}}
                    whileTap={product.stock > 0 ? { scale: 0.9 } : {}}
                  >
                    <Plus className="h-5 w-5" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Hygiene & Daily Essentials */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="frosted-card rounded-3xl border border-white/10 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">🧼 {"Hygiene & Daily Needs"}</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hygieneProducts.map((product) => (
                <motion.div
                  key={product.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-300/50"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{product.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm font-semibold text-cyan-400">₹{product.price}</span>
                      <span className={`text-xs ${getStockColor(product)}`}>
                        {getStockStatus(product)}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="ml-4 rounded-full bg-cyan-400/20 p-2 text-cyan-400 transition hover:bg-cyan-400/30 disabled:opacity-50"
                    whileHover={product.stock > 0 ? { scale: 1.1 } : {}}
                    whileTap={product.stock > 0 ? { scale: 0.9 } : {}}
                  >
                    <Plus className="h-5 w-5" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Seasonal Extras */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="frosted-card rounded-3xl border border-white/10 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">🌞 {"Seasonal Extras"}</h2>
                <p className="text-sm text-slate-400">{"Based on your past usage and common needs"}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {seasonalProducts.map((product) => (
                <motion.div
                  key={product.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-300/50"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{product.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm font-semibold text-cyan-400">₹{product.price}</span>
                      <span className={`text-xs ${getStockColor(product)}`}>
                        {getStockStatus(product)}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="ml-4 rounded-full bg-cyan-400/20 p-2 text-cyan-400 transition hover:bg-cyan-400/30 disabled:opacity-50"
                    whileHover={product.stock > 0 ? { scale: 1.1 } : {}}
                    whileTap={product.stock > 0 ? { scale: 0.9 } : {}}
                  >
                    <Plus className="h-5 w-5" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Bundles & Combos */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="frosted-card rounded-3xl border border-white/10 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">🧺 {"Bundles & Combos"}</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {bundles.map((bundle) => (
                <motion.div
                  key={bundle.id}
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 transition hover:border-cyan-300/50"
                  whileHover={{ y: -4 }}
                >
                  <h3 className="mb-2 text-lg font-semibold text-white">{bundle.name}</h3>
                  <p className="mb-3 text-sm text-slate-400">{bundle.description}</p>
                  <div className="mb-3 space-y-1">
                    {bundle.items.map((item) => (
                      <div key={item} className="text-xs text-slate-300">
                        • {item}
                      </div>
                    ))}
                  </div>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-2xl font-bold text-cyan-400">₹{bundle.price}</span>
                    <span className="text-sm text-slate-500 line-through">
                      ₹{bundle.originalPrice}
                    </span>
                  </div>
                  <motion.button
                    onClick={() => addBundleToCart(bundle)}
                    className="w-full rounded-full bg-gradient-to-r from-purple-400 to-pink-500 px-4 py-2 font-semibold text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {"Buy Bundle"}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Footer Notes */}
        <motion.footer
          className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="space-y-2">
            <p>• {"OTC medicines only. No prescription drugs dispensed."}</p>
            <p>• {"Serious injury? Use 'Health Assistance' for guided help."}</p>
            <p>• {"Stock updates every 30 minutes."}</p>
          </div>
        </motion.footer>
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
            />
            <motion.div
              className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto bg-slate-900 p-6 shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">{"Shopping Cart"}</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-slate-400 transition hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingCart className="mb-4 h-16 w-16 text-slate-600" />
                  <p className="text-slate-400">{"Your cart is empty"}</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-white">{item.name}</h3>
                          <p className="text-sm text-cyan-400">₹{item.price} each</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <motion.button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="rounded-full bg-white/10 p-1.5 text-white transition hover:bg-white/20"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Minus className="h-4 w-4" />
                          </motion.button>
                          <span className="w-8 text-center font-semibold text-white">
                            {item.quantity}
                          </span>
                          <motion.button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="rounded-full bg-white/10 p-1.5 text-white transition hover:bg-white/20"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Plus className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => removeFromCart(item.id)}
                            className="rounded-full bg-red-500/20 p-1.5 text-red-400 transition hover:bg-red-500/30"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-6">
                    <div className="mb-4 flex items-center justify-between text-lg font-semibold text-white">
                      <span>{"Total"}:</span>
                      <span className="text-cyan-400">₹{total}</span>
                    </div>

                    {!showCheckout ? (
                      <motion.button
                        onClick={() => setShowCheckout(true)}
                        className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {"Proceed to Checkout"}
                      </motion.button>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <p className="mb-3 text-sm font-medium text-slate-300">
                            {"Choose Payment Method"}:
                          </p>
                          <div className="space-y-2">
                            {(["UPI", "Card", "Cash"] as const).map((method) => (
                              <motion.button
                                key={method}
                                onClick={() => setPaymentMethod(method)}
                                className={`w-full rounded-xl border-2 px-4 py-3 text-left font-medium transition ${paymentMethod === method
                                  ? "border-cyan-400 bg-cyan-400/20 text-cyan-300"
                                  : "border-white/20 bg-white/5 text-slate-300 hover:border-cyan-400/50"
                                  }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {method}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {paymentMethod && (
                          <motion.button
                            onClick={() => {
                              alert(`Payment of ₹${total} via ${paymentMethod} completed!`);
                              setCart([]);
                              setShowCart(false);
                              setShowCheckout(false);
                              setPaymentMethod(null);
                            }}
                            className="w-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 px-6 py-3 font-semibold text-white shadow-lg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {"Complete Purchase"}
                          </motion.button>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
