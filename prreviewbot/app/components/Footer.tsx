export function Footer() {
    return (
        <footer className="border-t border-white/5 py-12 bg-black">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                    <div className="size-5 rounded bg-white/10 flex items-center justify-center">
                        <span className="text-white font-bold text-[10px]">PR</span>
                    </div>
                    <span className="text-sm text-zinc-500">
                        &copy; {new Date().getFullYear()} PRReviewBot. All rights reserved.
                    </span>
                </div>

                <div className="flex gap-8">
                    <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">Terms</a>
                    <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">Twitter</a>
                    <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">GitHub</a>
                </div>
            </div>
        </footer>
    );
}
