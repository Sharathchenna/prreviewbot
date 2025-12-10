"use client";

import { cn } from "../lib/utils";
import { Zap, Shield, Search, LayoutTemplate, Lock, Clock, FileCheck } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Context-Aware Analysis",
    description: "Deep semantic understanding of your changes, not just regex matching.",
    icon: <Search className="size-5 text-indigo-500" />,
    className: "md:col-span-2 md:row-span-2",
    delay: 0.1,
    visual: (
        <div className="absolute inset-x-6 bottom-6 h-48 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden flex flex-col shadow-inner">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 bg-white">
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-300" />
                    <div className="w-2 h-2 rounded-full bg-amber-300" />
                    <div className="w-2 h-2 rounded-full bg-green-300" />
                </div>
                <div className="w-24 h-1.5 rounded-full bg-slate-100 ml-2" />
            </div>
            <div className="p-4 space-y-3 relative">
                {/* Code Lines */}
                <div className="flex gap-3 items-center">
                    <div className="w-4 text-[10px] text-slate-300">01</div>
                    <div className="w-1/3 h-1.5 rounded-full bg-indigo-100" />
                </div>
                <div className="flex gap-3 items-center">
                    <div className="w-4 text-[10px] text-slate-300">02</div>
                    <div className="w-1/2 h-1.5 rounded-full bg-slate-200" />
                </div>
                <div className="flex gap-3 items-center bg-red-50 -mx-4 px-4 py-1 border-l-2 border-red-300">
                    <div className="w-4 text-[10px] text-slate-300">03</div>
                    <div className="w-2/3 h-1.5 rounded-full bg-slate-300" />
                    <div className="ml-auto px-2 py-0.5 bg-red-100 text-[8px] text-red-600 rounded font-medium">Bug</div>
                </div>
                <div className="flex gap-3 items-center">
                    <div className="w-4 text-[10px] text-slate-300">04</div>
                    <div className="w-1/4 h-1.5 rounded-full bg-slate-200" />
                </div>
                
                 {/* Floating Tooltip */}
                 <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-12 right-4 bg-white border border-slate-200 shadow-lg rounded-lg p-2 max-w-[140px]"
                 >
                     <div className="flex items-center gap-1.5 mb-1">
                         <div className="size-3 rounded-full bg-indigo-100 flex items-center justify-center text-[8px] text-indigo-600 font-bold">AI</div>
                         <span className="text-[9px] font-semibold text-slate-700">Suggestion</span>
                     </div>
                     <div className="h-1 w-full bg-slate-100 rounded mb-1" />
                     <div className="h-1 w-2/3 bg-slate-100 rounded" />
                 </motion.div>
            </div>
        </div>
    )
  },
  {
    title: "Lightning Fast",
    description: "Feedback in seconds, unblocking your team's velocity.",
    icon: <Zap className="size-5 text-amber-500" />,
    className: "md:col-span-1 md:row-span-1",
    delay: 0.2,
    visual: (
        <div className="absolute inset-x-6 bottom-4 h-20 flex items-end justify-between px-2 gap-2">
            {[40, 70, 50, 90, 60, 80].map((h, i) => (
                <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ delay: 0.3 + (i * 0.1), duration: 0.5 }}
                    className="w-full bg-amber-100 rounded-t-sm relative overflow-hidden group-hover:bg-amber-200 transition-colors"
                >
                    {/* Top highlight */}
                    <div className="absolute top-0 w-full h-1 bg-amber-300 opacity-50" />
                </motion.div>
            ))}
        </div>
    )
  },
  {
    title: "Framework Native",
    description: "Specialized rules for Flutter, React, and Node.js.",
    icon: <LayoutTemplate className="size-5 text-pink-500" />,
    className: "md:col-span-1 md:row-span-1",
    delay: 0.3,
    visual: (
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-pink-50/50 to-transparent flex items-center justify-center gap-4">
            <div className="size-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center transform -rotate-6 translate-y-2">
                <div className="size-5 bg-sky-100 rounded-full" /> {/* Reactish */}
            </div>
            <div className="size-12 rounded-xl bg-white border border-slate-100 shadow-md flex items-center justify-center z-10">
                <div className="size-6 bg-blue-100 rounded" /> {/* Flutterish */}
            </div>
             <div className="size-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center transform rotate-6 translate-y-2">
                <div className="size-5 bg-green-100 rounded-full" /> {/* Nodeish */}
            </div>
        </div>
    )
  },
  {
    title: "Bank-Grade Security",
    description: "Ephemeral processing environments. Your code never persists.",
    icon: <Shield className="size-5 text-emerald-500" />,
    className: "md:col-span-2",
    delay: 0.4,
    visual: (
        <div className="absolute top-8 right-8 w-32 h-32 opacity-20 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 bg-emerald-100/50 rounded-full blur-2xl" />
            <div className="absolute inset-0 flex items-center justify-center">
                 <Lock className="size-16 text-emerald-200" />
            </div>
        </div>
    )
  },
];

export function Features() {
  return (
    <section id="features" className="py-32 relative overflow-hidden bg-gradient-to-b from-white via-orange-50/30 to-white">
      {/* Mesh Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-20 md:text-center max-w-3xl mx-auto">
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600 mb-6"
          >
              <FileCheck className="size-3.5" />
              <span>Everything you need</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight"
          >
            Not just another linter. <br />
            <span className="text-slate-400">A virtual senior engineer.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg leading-relaxed"
          >
            Traditional tools catch syntax errors. PRReviewBot catches logic flaws, architectural drifts, and maintenance nightmares before they merge.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: feature.delay }}
              className={cn(
                "group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-orange-200/50 transition-all duration-500 flex flex-col justify-between",
                feature.className
              )}
            >
              <div className="relative z-10">
                <div className="mb-4 inline-flex p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 shadow-sm group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-[90%]">
                    {feature.description}
                </p>
              </div>

                {/* Visual Component Container */}
                {feature.visual && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 relative flex-1 min-h-[100px]"
                    >
                        {feature.visual}
                    </motion.div>
                )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
