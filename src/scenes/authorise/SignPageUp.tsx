import {useState} from "react";
import {useForm} from "react-hook-form";
import {Eye, EyeOff, Lock, User, UserPlus} from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import {signUpApi} from "@/api/authApi/authService.ts";

type SignUpPayload = {
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    email: string;
};
//
// // --- MOCK REDUXA (RTK Query) ---
// // POST /auth/signup/
// const useSignUpMutation = () => {
//     const [isLoading, setIsLoading] = useState(false);
//
//     const signUp = async (payload: SignUpPayload) => {
//         setIsLoading(true);
//
//         return new Promise<SignUpPayload & { id: number }>((resolve, reject) => {
//             setTimeout(() => {
//                 setIsLoading(false);
//
//                 if (payload.username === "admin") {
//                     reject({
//                         error: {
//                             message: "User with this username already exists",
//                         },
//                     });
//                 } else {
//                     resolve({
//                         id: 1,
//                         ...payload,
//                     });
//                 }
//             }, 1000);
//         });
//     };
//
//     return [signUp, {isLoading}] as const;
// };

// -------------------------------------------------------

export function SignPageUp() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<SignUpPayload>();


    const onSubmit = async (formData: SignUpPayload) => {
        setServerError(null);
        setIsLoading(true);
        try {
            console.log("Sign Up", formData);
            await signUpApi(formData);
            console.log("Sign Up success");
            navigate("/login");
        } catch (err: any) {
            console.log(err);
            setServerError(err.message || "Register failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="h-[calc(90vh-64px)] w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-sky-50 to-blue-50 px-8 py-8 text-center border-b border-gray-100">
                    <div
                        className="mx-auto w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4">
                        <UserPlus className="w-6 h-6 text-sky-600"/>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Create account</h2>
                    <p className="text-gray-500 mt-2 text-sm">
                        Sign up to access your training schedule
                    </p>
                </div>

                {/* Form */}
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Username */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 block">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <User className="w-5 h-5"/>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    {...register("username", {required: "Username is required"})}
                                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border ${
                                        errors.username
                                            ? "border-red-500 focus:ring-red-200"
                                            : "border-gray-200 focus:ring-sky-200"
                                    } rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:ring-4 transition-all`}
                                />
                            </div>
                            {errors.username && (
                                <p className="text-xs text-red-500">
                                    {String(errors.username.message)}
                                </p>
                            )}
                        </div>

                        {/* First name */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 block">
                                First name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your first name"
                                {...register("first_name", {required: "First name is required"})}
                                className={`w-full px-4 py-2.5 bg-gray-50 border ${
                                    errors.first_name
                                        ? "border-red-500 focus:ring-red-200"
                                        : "border-gray-200 focus:ring-sky-200"
                                } rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:ring-4 transition-all`}
                            />
                            {errors.first_name && (
                                <p className="text-xs text-red-500">
                                    {String(errors.first_name.message)}
                                </p>
                            )}
                        </div>

                        {/* Last name */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 block">
                                Last name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your last name"
                                {...register("last_name", {required: "Last name is required"})}
                                className={`w-full px-4 py-2.5 bg-gray-50 border ${
                                    errors.last_name
                                        ? "border-red-500 focus:ring-red-200"
                                        : "border-gray-200 focus:ring-sky-200"
                                } rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:ring-4 transition-all`}
                            />
                            {errors.last_name && (
                                <p className="text-xs text-red-500">
                                    {String(errors.last_name.message)}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 block">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /\S+@\S+\.\S+/,
                                        message: "Invalid email",
                                    },
                                })}
                                className={`w-full px-4 py-2.5 bg-gray-50 border ${
                                    errors.email
                                        ? "border-red-500 focus:ring-red-200"
                                        : "border-gray-200 focus:ring-sky-200"
                                } rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:ring-4 transition-all`}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">
                                    {String(errors.email.message)}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 block">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock className="w-5 h-5"/>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    {...register("password", {required: "Password is required"})}
                                    className={`w-full pl-10 pr-12 py-2.5 bg-gray-50 border ${
                                        errors.password
                                            ? "border-red-500 focus:ring-red-200"
                                            : "border-gray-200 focus:ring-sky-200"
                                    } rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:ring-4 transition-all`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500">
                                    {String(errors.password.message)}
                                </p>
                            )}
                        </div>

                        {serverError && (
                            <div
                                className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm text-center">
                                {serverError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading ? "Signing up..." : "Sign Up"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link to="/login" className="text-sky-600 font-semibold hover:underline">
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
