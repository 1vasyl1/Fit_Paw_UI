export function Footer() {
    return (
        <footer className="shrink-0 border-t border-slate-200 bg-white">
            <div
                className="mx-auto flex w-full max-w-5xl flex-col items-center gap-1 px-4 py-5 text-center text-xs text-slate-400">
                <span>© {new Date().getFullYear()} FitPaw</span>
                <span>Fitness planning that fits your life</span>
            </div>
        </footer>
    );
}
