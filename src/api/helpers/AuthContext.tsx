import type {ReactNode} from "react";
import {createContext, useState} from "react";

type AuthContextType = {
    isAuthenticated: boolean;
    loginUser: (token: string) => void;
    logoutUser: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("token")
    );

    const loginUser = (token: string) => {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
    };

    const logoutUser = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, loginUser, logoutUser}}>
            {children}
        </AuthContext.Provider>
    );
}

export {AuthContext};
