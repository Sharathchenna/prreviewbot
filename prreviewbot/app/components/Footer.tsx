"use client";

import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-slate-200 bg-slate-50/50 pt-20 pb-10 overflow-hidden">
        {/* Decorative Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="size-8 rounded-lg bg-gradient-peach flex items-center justify-center shadow-lg shadow-orange-500/10">
                <span className="text-white font-bold text-sm">PR</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">PRReviewBot</span>
            </Link>
            <p className="text-slate-500 max-w-sm leading-relaxed mb-6">
              Automating code reviews for modern engineering teams. 
              Catch bugs early, enforce standards, and ship faster.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-2 rounded-full bg-white border border-slate-200 hover:border-orange-200 text-slate-400 hover:text-orange-500 transition-colors shadow-sm">
                <Twitter className="size-5" />
              </Link>
              <Link href="https://github.com/sharathchenna/prreviewbot" className="p-2 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-400 hover:text-slate-900 transition-colors shadow-sm">
                <Github className="size-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link href="#features" className="hover:text-orange-500 transition-colors">Features</Link></li>
              <li><Link href="#how-it-works" className="hover:text-orange-500 transition-colors">How it Works</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} PRReviewBot. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
