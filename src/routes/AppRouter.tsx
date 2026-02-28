import {createBrowserRouter, createRoutesFromElements, Route,} from "react-router-dom";
import {Layout} from "../components/Layout";
import {HomePage} from "../scenes/home/HomePage.tsx";
import {AboutPage} from "../scenes/about/AboutPage.tsx";
import {SchedulePage} from "../scenes/schedule/SchedulePage.tsx";
import {LoginPage} from "../scenes/login/LoginPage.tsx";
import {SignUp} from "@/scenes/signup/SignUp.tsx";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="*" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignUp/>}/>
        </Route>
    )
);
