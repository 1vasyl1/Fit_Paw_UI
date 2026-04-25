import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Mail, QrCode, User} from "lucide-react";
import {getCurrentUser, updateCurrentUser} from "@/api/authApi/userService.ts";

type UserProfile = {
    id?: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
};

export function UserProfilePage() {

    const [userData, setUserData] = useState<UserProfile>({
        id: "1",
        username: "-",
        email: "-",
        first_name: "-",
        last_name: "-",
    });

    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    const {
        register,
        handleSubmit,
        formState: {errors, isDirty},
        reset,
    } = useForm<UserProfile>({
        defaultValues: userData,
    });

    useEffect(() => {
        const fetchUser = async () => {
            setServerError(null);
            setIsLoadingProfile(true);

            try {
                const currentUser = await getCurrentUser();

                const mappedUser: UserProfile = {
                    id: currentUser.id,
                    username: currentUser.username,
                    email: currentUser.email,
                    first_name: currentUser.first_name,
                    last_name: currentUser.last_name,
                };

                setUserData(mappedUser);
                reset(mappedUser);
            } catch (err: any) {
                console.error(err);
                setServerError(err.message || "Failed to load profile.");
            } finally {
                setIsLoadingProfile(false);
            }
        };

        fetchUser();
    }, [reset]);


    const onSubmit = async (formData: UserProfile) => {
        console.log(" Submitting formData:", formData);
        setServerError(null);
        setSaveSuccess(false);
        setIsSaving(true);

        try {
            const updatedUser = await updateCurrentUser({
                email: formData.email,
                first_name: formData.first_name,
                last_name: formData.last_name,
            });

            const mappedUser: UserProfile = {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
            };

            setUserData(mappedUser);
            reset(mappedUser);
            setSaveSuccess(true);

            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err: any) {
            console.error(err);
            setServerError(err.message || "Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };
    if (isLoadingProfile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
                <p className="text-sm text-gray-400">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex flex-col">
            <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">

                    <div
                        className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-8">
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-24 h-24 bg-sky-50 rounded-full flex items-center justify-center mb-4">
                                    <User className="w-12 h-12 text-sky-600"/>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-500 mb-1">Username</p>
                                    <p className="text-lg font-bold text-gray-900">{userData.username}</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 block">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Mail className="w-5 h-5"/>
                                        </div>
                                        <input
                                            type="email"
                                            {...register("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /\S+@\S+\.\S+/,
                                                    message: "Invalid email format",
                                                },
                                            })}
                                            className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border ${
                                                errors.email
                                                    ? "border-red-500 focus:ring-red-200"
                                                    : "border-gray-200 focus:ring-sky-200"
                                            } rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:ring-4 transition-all`}
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-xs text-red-500">{String(errors.email.message)}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 block">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        {...register("first_name", {required: "First name is required"})}
                                        className={`w-full px-4 py-2.5 bg-gray-50 border ${
                                            errors.first_name
                                                ? "border-red-500 focus:ring-red-200"
                                                : "border-gray-200 focus:ring-sky-200"
                                        } rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:ring-4 transition-all`}
                                        placeholder="First name"
                                    />
                                    {errors.first_name && (
                                        <p className="text-xs text-red-500">{String(errors.first_name.message)}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 block">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        {...register("last_name", {required: "Last name is required"})}
                                        className={`w-full px-4 py-2.5 bg-gray-50 border ${
                                            errors.last_name
                                                ? "border-red-500 focus:ring-red-200"
                                                : "border-gray-200 focus:ring-sky-200"
                                        } rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:ring-4 transition-all`}
                                        placeholder="Last name"
                                    />
                                    {errors.last_name && (
                                        <p className="text-xs text-red-500">{String(errors.last_name.message)}</p>
                                    )}
                                </div>

                                {serverError && (
                                    <div
                                        className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm text-center">
                                        {serverError}
                                    </div>
                                )}
                                {saveSuccess && (
                                    <div
                                        className="p-3 bg-green-50 border border-green-100 rounded-lg text-green-700 text-sm text-center">
                                        Profile updated successfully!
                                    </div>
                                )}

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={!isDirty || isSaving}
                                        className={`w-full font-medium py-3 rounded-xl transition-all active:scale-[0.98] ${
                                            isDirty && !isSaving
                                                ? "bg-gray-900 text-white hover:bg-gray-800 focus:ring-4 focus:ring-gray-200"
                                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        }`}
                                    >
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div
                        className="lg:col-span-1 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-8">
                            <h3 className="mb-6 text-lg font-bold text-gray-900 text-center">
                                Member QR Code
                            </h3>

                            <div
                                className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6">
                                <QrCode className="w-16 h-16 text-gray-400 mb-4"/>
                                <p className="text-gray-500 font-medium text-center">
                                    QR Code
                                </p>
                                <p className="text-sm text-gray-400 text-center mt-1">
                                    Scan at check-in
                                </p>
                            </div>

                            <p className="mt-6 text-sm text-gray-500 text-center">
                                Your personal enter QR-Code
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
