import {createBrowserRouter, createRoutesFromElements, Route,} from "react-router-dom";
import {Layout} from "../components/Layout";
import {HomePage} from "../scenes/home/HomePage.tsx";
import {AboutPage} from "../scenes/about/AboutPage.tsx";
import {SchedulePage} from "../scenes/schedule/SchedulePage.tsx";
import {LoginPage} from "@/scenes/authorise/LoginPage.tsx";
import {SignPageUp} from "@/scenes/authorise/SignPageUp.tsx";
import {UserProfilePage} from "@/scenes/user/UserPage.tsx";
import {CheckoutPage} from "@/scenes/payments/CheckOut.tsx";
import {PaymentReturnPage} from "@/scenes/payments/PaymentsReturnPage.tsx";
import {MembershipPage} from "@/scenes/membership/MembershipPage.tsx";
import {RequireAuth} from "@/routes/RequireAuth.tsx";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/about" element={<AboutPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignPageUp/>}/>
            <Route element={<RequireAuth/>}>
            <Route path="/profile" element={<UserProfilePage/>}/>
                <Route path="/payments" element={<CheckoutPage/>}/>
                <Route path="/returnpage" element={<PaymentReturnPage/>}/>
                <Route path="/payment/return" element={<PaymentReturnPage/>}/>
                <Route path="/membership" element={<MembershipPage/>}/>
            </Route>
            <Route path="*" element={<HomePage/>}/>
        </Route>
    )
);
