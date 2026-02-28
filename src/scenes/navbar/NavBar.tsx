import {Link, NavLink} from "react-router-dom";
import {useAuth} from "@/api/UseAuth.ts";

const baseLink =
    "px-3 py-2 rounded-md text-sm font-medium transition-colors";

const Navbar = () => {
    const {isAuthenticated, logoutUser} = useAuth();

    const handleLogout = () => {
        logoutUser();
    };

    return (
        <header className="border-b border-slate-200 bg-white">
            <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                <Link
                    to="/"
                    className="text-xl font-semibold text-sky-600 tracking-tight"
                >
                    FitPaw
                </Link>

                <div className="flex gap-2">
                    <NavLink
                        to="/"
                        end
                        className={({isActive}) =>
                            `${baseLink} ${
                                isActive
                                    ? "bg-sky-600 text-white"
                                    : "text-slate-700 hover:bg-sky-50"
                            }`
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/schedule"
                        className={({isActive}) =>
                            `${baseLink} ${
                                isActive
                                    ? "bg-sky-600 text-white"
                                    : "text-slate-700 hover:bg-sky-50"
                            }`
                        }
                    >
                        Schedule
                    </NavLink>

                    <NavLink
                        to="/about"
                        className={({isActive}) =>
                            `${baseLink} ${
                                isActive
                                    ? "bg-sky-600 text-white"
                                    : "text-slate-700 hover:bg-sky-50"
                            }`
                        }
                    >
                        About
                    </NavLink>
                </div>

                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors"
                        >
                            Log out
                        </button>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="hidden sm:block text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                className="text-sm font-medium bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
