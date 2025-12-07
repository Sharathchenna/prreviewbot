"use client";

import Link from "next/link";
import { cn } from "../lib/utils";
import { Github } from "lucide-react";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-background/60 backdrop-blur-md">
            <div className="flex items-center gap-2">
                <div className="size-6 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-white font-bold text-xs">PR</span>
                </div>
                <span className="text-sm font-medium tracking-tight">PRReviewBot</span>
            </div>

            <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
                <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
                {/* <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link> */}
            </div>

            <div className="flex items-center gap-4">
                {/* <Link
                    href="#"
                    className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:block"
                >
                    Login
                </Link> */}
                <Link
                    href="https://github.com/sharathchenna/prreviewbot"
                    target="_blank"
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 text-xs font-medium text-white rounded-full",
                        "bg-white/10 hover:bg-white/20 border border-white/10 transition-all",
                        "shadow-[0_0_20px_-10px_rgba(255,255,255,0.7)]"
                    )}
                >
                    <Github className="size-3.5" />
                    <span>Star on GitHub</span>
                </Link>
            </div>
        </nav>
    );
}
