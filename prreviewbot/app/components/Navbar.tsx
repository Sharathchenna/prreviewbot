"use client";

import Link from "next/link";
import { cn } from "../lib/utils";
import { Github, Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled
          ? "glass-nav py-4"
          : "bg-transparent py-6 border-b border-transparent"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative size-8 rounded-lg bg-gradient-peach flex items-center justify-center overflow-hidden shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/30 transition-shadow duration-300">
            <span className="relative z-10 text-white font-bold text-sm tracking-tighter">PR</span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-800">
            PRReviewBot
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Features", "How it Works"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="relative text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
            <div className="hidden md:block">
                <Link
                    href="https://github.com/sharathchenna/prreviewbot"
                    target="_blank"
                    className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 hover:border-slate-300 rounded-full bg-white hover:bg-slate-50 shadow-sm"
                >
                    <Github className="size-4" />
                    <span>Star on GitHub</span>
                </Link>
            </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-slate-600 hover:text-slate-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 shadow-xl"
          >
            <div className="flex flex-col p-6 gap-4">
              {["Features", "How it Works"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-slate-600 hover:text-primary py-2 text-lg font-medium flex items-center justify-between group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                  <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary" />
                </Link>
              ))}
               <Link
                href="https://github.com/sharathchenna/prreviewbot"
                target="_blank"
                className="flex items-center gap-2 text-slate-600 hover:text-primary py-2 text-lg font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
            >
                <Github className="size-5" />
                <span>Star on GitHub</span>
            </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}