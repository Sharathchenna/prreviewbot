"use client";

import { cn } from "../lib/utils";
import { Zap, Shield, Search, Code2, Bot, GitPullRequest } from "lucide-react";

const features = [
    {
        title: "Context-Aware Analysis",
        description: "Doesn't just lint errors. Understands the intent behind your code changes.",
        icon: <Search className="size-6 text-blue-400" />,
        className: "md:col-span-2",
        gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
        title: "Lightning Fast",
        description: "Get feedback in seconds, not hours. Unblock your team immediately.",
        icon: <Zap className="size-6 text-yellow-400" />,
        className: "md:col-span-1",
        gradient: "from-yellow-500/20 to-orange-500/20"
    },
    {
        title: "Flutter & Dart Native",
        description: "Built specifically to understand Widget lifecycles and State Management patterns.",
        icon: <Code2 className="size-6 text-blue-400" />,
        className: "md:col-span-1",
        gradient: "from-blue-600/20 to-indigo-600/20"
    },
    {
        title: "Secure by Design",
        description: "Your code never leaves your secure environment longer than needed for analysis.",
        icon: <Shield className="size-6 text-green-400" />,
        className: "md:col-span-2",
        gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
        title: "Automated Commenting",
        description: "Bots post helpful, constructive comments directly on your pull requests.",
        icon: <Bot className="size-6 text-purple-400" />,
        className: "md:col-span-2",
        gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
        title: "Seamless Integration",
        description: "Works out of the box with Gitea and generic git providers via webhooks.",
        icon: <GitPullRequest className="size-6 text-rose-400" />,
        className: "md:col-span-1",
        gradient: "from-rose-500/20 to-red-500/20"
    },
];

export function Features() {
    return (
        <section id="features" className="py-24 relative overflow-hidden">

            <div className="container mx-auto px-6">
                <div className="mb-16 md:text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Designed for modern workflows.</h2>
                    <p className="text-zinc-400 text-lg">
                        Stop wasting time on trivial nitpicks. Let the AI handle the basics so you can focus on architecture and logic.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className={cn(
                                "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 hover:bg-white/[0.06] transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-primary/5",
                                feature.className
                            )}
                        >
                            {/* Gradient Background Effect */}
                            <div className={cn(
                                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500",
                                feature.gradient
                            )} />

                            {/* Content */}
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="mb-6 inline-flex self-start p-3 rounded-2xl bg-white/5 border border-white/10 ring-1 ring-white/5 shadow-inner">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-zinc-100 mb-3 group-hover:text-white transition-colors">{feature.title}</h3>
                                <p className="text-zinc-400 leading-relaxed text-sm md:text-base">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
