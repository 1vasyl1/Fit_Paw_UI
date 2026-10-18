import {Outlet} from "react-router-dom";
import Navbar from "../scenes/navbar/NavBar.tsx";
import {Footer} from "./Footer.tsx";

export const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Navbar/>

            <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8">
                <Outlet/>
            </main>

            <Footer/>
        </div>
    );
};
