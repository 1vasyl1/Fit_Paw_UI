import {Outlet} from "react-router-dom";
import Navbar from "../scenes/navbar/NavBar.tsx";

export const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Navbar/>

            <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8">
                <Outlet/>
            </main>

            <footer className="border-t border-slate-200 bg-white flex items-center justify-between">
                <div className="mx-auto max-w-5xl px-4 py-4 text-xs text-slate-400">
                    © {new Date().getFullYear()} FitPaw
                </div>
            </footer>
        </div>
    );
};
