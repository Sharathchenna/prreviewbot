"use client";

import { cn } from "../lib/utils";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background Gradient Blurs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-40 mix-blend-screen" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full pointer-events-none opacity-30" />

            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">

                {/* Badge */}
                <div className="animate-fade-in-up opacity-0 flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-8 hover:bg-white/10 transition-colors cursor-default">
                    <Sparkles className="size-3" />
                    <span>AI-Powered Code Reviews 2.0</span>
                </div>

                {/* Heading */}
                <h1 className="animate-fade-in-up opacity-0 delay-100 max-w-4xl text-5xl md:text-7xl font-bold tracking-tight mb-8">
                    Code reviews that <br />
                    <span className="text-gradient block mt-2">feel like magic.</span>
                </h1>

                {/* Subtitle */}
                <p className="animate-fade-in-up opacity-0 delay-200 max-w-2xl text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed">
                    Automate your pull request reviews with an intelligent agent that understands context, catches bugs, and suggests idiomatic improvements for Flutter & Dart.
                </p>

                {/* Buttons */}
                <div className="animate-fade-in-up opacity-0 delay-300 flex flex-col sm:flex-row items-center gap-4">
                    <Link
                        href="#"
                        className={cn(
                            "group relative flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold text-white rounded-full bg-white/10 hover:bg-white/15 border border-white/10 overflow-hidden transition-all",
                            "shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_-10px_rgba(139,92,246,0.5)]"
                        )}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span>Get Started</span>
                        <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        href="#how-it-works"
                        className="flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                    >
                        How it works
                    </Link>
                </div>

                {/* Social Proof / Mini Feature List */}
                <div className="animate-fade-in-up opacity-0 delay-300 mt-16 flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-medium text-zinc-500">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-primary" />
                        <span>Instant Analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-primary" />
                        <span>Flutter Optimized</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-primary" />
                        <span>Gitea Integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-primary" />
                        <span>Secure & Private</span>
                    </div>
                </div>

            </div>
        </section>
    );
}
