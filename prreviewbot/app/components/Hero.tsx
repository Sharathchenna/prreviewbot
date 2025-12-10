"use client";

import { cn } from "../lib/utils";
import { ArrowRight, Sparkles, Shield, Terminal, Bot } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden min-h-[90vh] flex items-center justify-center bg-white">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-light [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] -z-10" />
      
      {/* Warm Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-orange-100 to-rose-100 blur-[100px] rounded-full pointer-events-none opacity-60" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-50/80 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        
        {/* Badge */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-xs font-semibold text-orange-600 mb-8 hover:bg-orange-100 transition-colors shadow-sm cursor-default"
        >
          <Sparkles className="size-3 text-orange-500" />
          <span>v2.0 Now Available</span>
        </motion.div>

        {/* Heading */}
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-slate-900 leading-[1.1]"
        >
          Code reviews <br />
          <span className="text-gradient-peach relative inline-block">
            on autopilot.
            {/* Underline Decoration */}
             <svg className="absolute -bottom-1 left-0 w-full h-3 text-orange-300 opacity-60 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 12 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
             </svg>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl text-lg md:text-xl text-slate-500 mb-10 leading-relaxed font-light"
        >
          Deploy an intelligent agent that understands your codebase. 
          Catch bugs, enforce patterns, and merge with confidence.
        </motion.p>

        {/* CTAs */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-20"
        >
          <Link
            href="#"
            className={cn(
              "group relative flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-full bg-slate-900 hover:bg-slate-800 transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
            )}
          >
            <span>Start Free Trial</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="https://github.com/sharathchenna/prreviewbot"
            target="_blank"
            className="flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 hover:border-slate-300 rounded-full bg-white hover:bg-slate-50"
          >
            View on GitHub
          </Link>
        </motion.div>

        {/* VISUALIZATION: The "Light Mode IDE" */}
        <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring", bounce: 0.3 }}
            className="relative w-full max-w-5xl mx-auto perspective-1000"
        >
            {/* The Main Card */}
            <div className="relative z-10 rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden ring-1 ring-black/5">
                
                {/* Toolbar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="size-3 rounded-full bg-slate-200 border border-slate-300" />
                            <div className="size-3 rounded-full bg-slate-200 border border-slate-300" />
                            <div className="size-3 rounded-full bg-slate-200 border border-slate-300" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                         <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-slate-200 shadow-sm text-slate-600">
                            <Terminal className="size-3 text-orange-500" />
                            <span>analysis_worker.ts</span>
                        </div>
                    </div>
                    <div className="w-12" /> 
                </div>

                {/* Grid Layout for Visualization */}
                <div className="grid grid-cols-1 md:grid-cols-3 h-[400px]">
                    
                    {/* Left: Code View (Light Theme Code) */}
                    <div className="md:col-span-2 p-8 font-mono text-sm border-r border-slate-100 relative overflow-hidden text-left bg-white">
                         {/* Scanning Beam (Peach) */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-400/50 to-transparent blur-sm z-20 animate-scan" />
                        
                        <div className="space-y-3 opacity-90">
                            <div className="flex gap-4">
                                <span className="text-slate-300 select-none">01</span>
                                <span className="text-purple-600">import</span> <span className="text-slate-800">{"{"} <span className="text-orange-600">Context</span> {"}"}</span> <span className="text-purple-600">from</span> <span className="text-green-600">'./types'</span>;
                            </div>
                            <div className="flex gap-4">
                                <span className="text-slate-300 select-none">02</span>
                                <span></span>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-slate-300 select-none">03</span>
                                <span className="text-purple-600">export const</span> <span className="text-blue-600">analyzeDiff</span> = <span className="text-purple-600">async</span> (<span className="text-slate-800">pr</span>: <span className="text-orange-600">PullRequest</span>) ={">"} {"{"}
                            </div>
                            
                            {/* Flagged Line */}
                            <div className="flex gap-4 bg-red-50 -mx-8 px-8 border-l-4 border-red-400">
                                <span className="text-slate-300 select-none">04</span>
                                <span className="pl-4 text-slate-500 italic">// TODO: Refactor legacy loop</span>
                            </div>

                            <div className="flex gap-4">
                                <span className="text-slate-300 select-none">05</span>
                                <span className="pl-4 text-purple-600">const</span> <span className="text-slate-800">riskScore</span> = <span className="text-blue-600">calculateRisk</span>(pr.files);
                            </div>
                             <div className="flex gap-4">
                                <span className="text-slate-300 select-none">06</span>
                                <span className="pl-4 text-purple-600">if</span> (riskScore {">"} <span className="text-orange-600">0.8</span>) {"{"}
                            </div>

                             {/* Optimization Line */}
                             <div className="flex gap-4 bg-emerald-50 -mx-8 px-8 border-l-4 border-emerald-400">
                                <span className="text-slate-300 select-none">07</span>
                                <span className="pl-8 text-slate-800"><span className="text-purple-600">await</span> <span className="text-blue-600">requestSeniorReview</span>(pr.id);</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-slate-300 select-none">08</span>
                                <span className="pl-4 text-slate-800">{"}"}</span>
                            </div>
                             <div className="flex gap-4">
                                <span className="text-slate-300 select-none">09</span>
                                <span className="pl-4 text-purple-600">return</span> <span className="text-slate-800">riskScore</span>;
                            </div>
                            <div className="flex gap-4">
                                <span className="text-slate-300 select-none">10</span>
                                <span className="text-slate-800">{"}"}</span>
                            </div>
                        </div>

                         {/* Floating Detection Markers */}
                         <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.5, duration: 0.5 }}
                            className="absolute top-[108px] right-8 bg-white border border-red-200 text-red-600 text-xs px-2 py-1 rounded shadow-lg flex items-center gap-1"
                        >
                            <Shield className="size-3" />
                            <span>Security Risk</span>
                         </motion.div>

                         <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 2, duration: 0.5 }}
                            className="absolute top-[180px] right-16 bg-white border border-emerald-200 text-emerald-600 text-xs px-2 py-1 rounded shadow-lg flex items-center gap-1"
                        >
                            <Sparkles className="size-3" />
                            <span>Optimization</span>
                         </motion.div>
                    </div>

                    {/* Right: Analysis Log (Light) */}
                    <div className="hidden md:flex flex-col bg-slate-50 p-6 font-mono text-xs text-left border-l border-slate-100">
                        <div className="text-slate-400 mb-4 pb-2 border-b border-slate-200 uppercase tracking-wider text-[10px] font-semibold">System Log</div>
                        <div className="space-y-3">
                             <div className="flex gap-2 text-emerald-600">
                                <span className="text-slate-400">[12:04:01]</span>
                                <span>Connected to repository...</span>
                             </div>
                             <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex gap-2 text-blue-600"
                            >
                                <span className="text-slate-400">[12:04:02]</span>
                                <span>Fetching PR #42 diff...</span>
                             </motion.div>
                             
                             {/* Dynamic Loading Bars */}
                             <div className="mt-6 space-y-4">
                                <div>
                                    <div className="flex justify-between text-slate-500 mb-1 font-semibold">
                                        <span>Complexity</span>
                                        <span className="text-orange-500">Low</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: "0%" }}
                                            animate={{ width: "30%" }}
                                            transition={{ delay: 1.2, duration: 1 }}
                                            className="h-full bg-orange-400"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-slate-500 mb-1 font-semibold">
                                        <span>Test Coverage</span>
                                        <span className="text-red-500">Missing</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: "0%" }}
                                            animate={{ width: "80%" }}
                                            transition={{ delay: 1.5, duration: 1 }}
                                            className="h-full bg-red-400"
                                        />
                                    </div>
                                </div>
                             </div>

                             <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 2.5 }}
                                className="mt-auto p-4 rounded-lg bg-white border border-slate-200 shadow-sm"
                            >
                                <div className="flex items-center gap-2 text-slate-800 font-semibold mb-1">
                                    <Bot className="size-4 text-orange-500" />
                                    <span>Suggestion Generated</span>
                                </div>
                                <p className="text-slate-500 leading-relaxed">
                                    "Consider extracting this logic to a utility function to improve readability."
                                </p>
                             </motion.div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Background Glow behind Card */}
            <div className="absolute inset-0 bg-orange-200/40 blur-[80px] -z-10 rounded-full opacity-40" />
        </motion.div>

      </div>
    </section>
  );
}