"use client";

import { cn } from "../lib/utils";
import { GitMerge, Bot, MessageSquare, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "Connect Your Repository",
    description: "Install the PRReviewBot app on your GitHub or Gitea repository. One-click setup, no complex configuration required.",
    icon: <GitMerge className="size-6 text-indigo-600" />,
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    line: "from-indigo-200"
  },
  {
    id: 2,
    title: "Open a Pull Request",
    description: "Work as usual. When you open a PR, our webhook automatically triggers the analysis engine securely.",
    icon: <Bot className="size-6 text-orange-600" />,
    bg: "bg-orange-50",
    border: "border-orange-100",
    line: "via-orange-200"
  },
  {
    id: 3,
    title: "Get Instant Feedback",
    description: "Receive an AI-generated review with context-aware suggestions, bug detections, and optimizations directly in the diff.",
    icon: <MessageSquare className="size-6 text-emerald-600" />,
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    line: "to-emerald-200"
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-white">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-20 text-center max-w-2xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6 text-slate-900"
          >
            Simple, seamless workflow.
          </motion.h2>
          <p className="text-slate-500 text-lg">
            No new tools to learn. PRReviewBot integrates directly into your existing development process.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-100 via-orange-100 to-emerald-100 -translate-x-1/2" />

          <div className="space-y-12 md:space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={cn(
                  "relative flex flex-col md:flex-row items-center gap-8 md:gap-16",
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                )}
              >
                {/* Icon Marker */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white border-4 border-white z-10 shadow-lg">
                    <div className={cn("w-4 h-4 rounded-full", step.bg.replace("50", "500"))} />
                </div>

                {/* Content Side */}
                <div className="flex-1 text-center md:text-left">
                   <div className={cn(
                       "inline-flex p-4 rounded-2xl mb-6 shadow-sm border",
                       step.bg, step.border
                   )}>
                       {step.icon}
                   </div>
                   <h3 className="text-2xl font-bold text-slate-900 mb-4">
                       <span className="text-slate-300 mr-2">0{step.id}.</span>
                       {step.title}
                   </h3>
                   <p className="text-slate-500 leading-relaxed">
                       {step.description}
                   </p>
                </div>

                {/* Empty Side for balance */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}