"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/app/_trpc/client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { profileSchema, passwordSchema, ProfileFormValues, PasswordFormValues } from "./profile-schema";
import { useRouter } from "next/navigation";

export function ProfileView() {
  const router = useRouter();
  const { data: session } = useSession();
  const utils = trpc.useUtils();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const { data: profileData, isLoading } = trpc.profile.getProfile.useQuery();

  const updateProfileMutation = trpc.profile.updateProfile.useMutation({
    onSuccess: () => {
      utils.profile.getProfile.invalidate();
      setSuccessMessage("پروفایل با موفقیت بروزرسانی شد");
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(null), 3000);
    },
  });

  const changePasswordMutation = trpc.profile.changePassword.useMutation({
    onSuccess: () => {
      setSuccessMessage("کلمه عبور با موفقیت تغییر کرد");
      passwordForm.reset();
      setShowPasswordChange(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(null), 3000);
    },
  });

  const reset2FAMutation = trpc.profile.reset2FA.useMutation({
      onSuccess: () => {
          signOut({ callbackUrl: '/setup-2fa' });
      },
      onError: (error) => {
          setErrorMessage(error.message);
      }
  });

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: "", nationalCode: "", phoneNumber: "", birthDate: "" },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (profileData) {
      profileForm.reset({
        fullName: profileData.fullName || "",
        nationalCode: profileData.nationalCode || "",
        phoneNumber: profileData.phoneNumber || "",
        birthDate: profileData.birthDate || "",
      });
    }
  }, [profileData, profileForm]);

  const onProfileSubmit = (data: ProfileFormValues) => updateProfileMutation.mutate(data);
  const onPasswordSubmit = (data: PasswordFormValues) => changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
  });

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 bg-gray-50 dark:bg-background-dark/50">
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">تنظیمات حساب کاربری</h2>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">اطلاعات شخصی و امنیت حساب خود را مدیریت کنید.</p>
            </div>

             {/* Notifications */}
            {successMessage && (
                <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center gap-2 animate-fade-in">
                <span className="material-symbols-outlined">check_circle</span>
                {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 animate-fade-in">
                <span className="material-symbols-outlined">error</span>
                {errorMessage}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* User Information Card */}
                <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark card-shadow flex flex-col">
                    <div className="p-6 border-b border-border-light dark:border-border-dark flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                                <span className="material-symbols-outlined">person</span>
                            </div>
                            <div>
                                <h3 className="font-bold">اطلاعات کاربری</h3>
                                <p className="text-[10px] text-text-secondary-light">مشخصات فردی و تماس</p>
                            </div>
                        </div>
                         {/* Edit button could toggle read-only state if desired, but for now forms are always editable */}
                    </div>
                    <div className="p-6 space-y-5">
                         <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-text-secondary-light mb-1 uppercase tracking-wider">نام و نام خانوادگی</label>
                                    <input
                                        {...profileForm.register("fullName")}
                                        className="w-full text-sm bg-gray-50 dark:bg-gray-900 border-border-light dark:border-border-dark rounded-lg focus:ring-primary focus:border-primary px-3 py-2"
                                        type="text"
                                    />
                                     {profileForm.formState.errors.fullName && <p className="text-xs text-red-500 mt-1">{profileForm.formState.errors.fullName.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-text-secondary-light mb-1 uppercase tracking-wider">کد ملی</label>
                                    <input
                                        {...profileForm.register("nationalCode")}
                                        className="w-full text-sm bg-gray-100 dark:bg-gray-800 border-border-light dark:border-border-dark rounded-lg cursor-not-allowed text-text-secondary-light px-3 py-2"
                                        disabled
                                        type="text"
                                    />
                                </div>
                            </div>
                             <div className="mb-4">
                                <label className="block text-[10px] font-bold text-text-secondary-light mb-1 uppercase tracking-wider">تاریخ تولد</label>
                                <input
                                    {...profileForm.register("birthDate")}
                                    className="w-full text-sm bg-gray-50 dark:bg-gray-900 border-border-light dark:border-border-dark rounded-lg focus:ring-primary focus:border-primary px-3 py-2"
                                    type="date"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-[10px] font-bold text-text-secondary-light mb-1 uppercase tracking-wider">شماره همراه</label>
                                <div className="flex gap-2">
                                    <input
                                        {...profileForm.register("phoneNumber")}
                                        className="flex-1 text-sm bg-gray-50 dark:bg-gray-900 border-border-light dark:border-border-dark rounded-lg focus:ring-primary focus:border-primary text-left px-3 py-2"
                                        dir="ltr"
                                        type="text"
                                    />
                                    {/* Verification button is visual-only for now based on spec, logic not requested */}
                                    <button type="button" className="px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800">تأیید موبایل</button>
                                </div>
                                {profileForm.formState.errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{profileForm.formState.errors.phoneNumber.message}</p>}
                            </div>
                            <div className="pt-2">
                                <button
                                    disabled={updateProfileMutation.isPending}
                                    className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-lg transition-colors shadow-sm shadow-emerald-200 dark:shadow-none disabled:opacity-70">
                                    {updateProfileMutation.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Security and Login Card */}
                <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark card-shadow flex flex-col">
                    <div className="p-6 border-b border-border-light dark:border-border-dark flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                                <span className="material-symbols-outlined">security</span>
                            </div>
                            <div>
                                <h3 className="font-bold">امنیت و ورود</h3>
                                <p className="text-[10px] text-text-secondary-light">گذرواژه و احراز هویت دومرحله‌ای</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-6">
                        {/* Password Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-text-primary-light dark:text-text-primary-dark">گذرواژه</h4>
                                <span className="text-[10px] text-text-secondary-light">آخرین تغییر: ۳ ماه پیش</span>
                            </div>

                            {!showPasswordChange ? (
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="relative">
                                        <input className="w-full text-sm bg-gray-50 dark:bg-gray-900 border-border-light dark:border-border-dark rounded-lg focus:ring-primary focus:border-primary pr-10 px-3 py-2" placeholder="••••••••" type="password" disabled/>
                                        <span className="material-symbols-outlined absolute right-3 top-2.5 text-text-secondary-light text-xl">lock</span>
                                    </div>
                                    <button
                                        onClick={() => setShowPasswordChange(true)}
                                        className="text-right text-xs text-primary font-medium hover:underline">
                                        تغییر گذرواژه
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-border-light dark:border-border-dark space-y-3">
                                     <div>
                                        <label className="block text-[10px] font-bold text-text-secondary-light mb-1">گذرواژه فعلی</label>
                                        <input
                                            {...passwordForm.register("currentPassword")}
                                            className="w-full text-sm bg-white dark:bg-gray-800 border-border-light dark:border-border-dark rounded-lg focus:ring-primary focus:border-primary px-3 py-2"
                                            type="password"
                                        />
                                        {passwordForm.formState.errors.currentPassword && <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.currentPassword.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-text-secondary-light mb-1">گذرواژه جدید</label>
                                        <input
                                            {...passwordForm.register("newPassword")}
                                            className="w-full text-sm bg-white dark:bg-gray-800 border-border-light dark:border-border-dark rounded-lg focus:ring-primary focus:border-primary px-3 py-2"
                                            type="password"
                                        />
                                        {passwordForm.formState.errors.newPassword && <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.newPassword.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-text-secondary-light mb-1">تکرار گذرواژه جدید</label>
                                        <input
                                            {...passwordForm.register("confirmPassword")}
                                            className="w-full text-sm bg-white dark:bg-gray-800 border-border-light dark:border-border-dark rounded-lg focus:ring-primary focus:border-primary px-3 py-2"
                                            type="password"
                                        />
                                        {passwordForm.formState.errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>}
                                    </div>
                                    <div className="flex gap-2 justify-end pt-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowPasswordChange(false);
                                                passwordForm.reset();
                                            }}
                                            className="px-3 py-1.5 text-xs text-text-secondary-light hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                        >
                                            انصراف
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={changePasswordMutation.isPending}
                                            className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded shadow-sm hover:bg-primary-dark transition-colors disabled:opacity-70"
                                        >
                                            {changePasswordMutation.isPending ? "..." : "ذخیره"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        <hr className="border-border-light dark:border-border-dark"/>

                        {/* 2FA Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-xs font-bold text-text-primary-light dark:text-text-primary-dark">احراز هویت دو مرحله‌ای (2FA)</h4>
                                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${profileData?.totpEnabled ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                                        {profileData?.totpEnabled ? "فعال" : "غیرفعال"}
                                    </span>
                                </div>
                                <span className={`material-symbols-outlined text-lg ${profileData?.totpEnabled ? "text-green-500" : "text-gray-400"}`}>verified_user</span>
                            </div>
                            <p className="text-[11px] text-text-secondary-light leading-relaxed">
                                برای امنیت بیشتر، در هر بار ورود علاوه بر رمز عبور، کدی به شماره همراه شما پیامک می‌شود (یا از طریق اپلیکیشن Authenticator).
                            </p>

                            {profileData?.totpEnabled ? (
                                <div className="relative">
                                    <input className="hidden peer" id="reset-2fa-trigger" type="checkbox"/>

                                    {/* Confirmation Box (Shown when checkbox is checked) */}
                                    <div className="hidden peer-checked:flex bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/40 p-4 rounded-lg flex-col gap-3" id="reset-confirmation">
                                        <div className="flex gap-3">
                                            <span className="material-symbols-outlined text-orange-600 text-xl">info</span>
                                            <p className="text-xs text-orange-800 dark:text-orange-300 leading-normal">
                                                با بازنشانی تنظیمات 2FA، شما از حساب کاربری خارج می‌شوید و باید مجدداً احراز هویت را راه‌اندازی کنید. آیا مطمئن هستید؟
                                            </p>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <label className="px-3 py-1.5 text-[10px] font-bold text-text-secondary-light cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-800 rounded" htmlFor="reset-2fa-trigger">انصراف</label>
                                            <button
                                                onClick={() => reset2FAMutation.mutate()}
                                                disabled={reset2FAMutation.isPending}
                                                className="px-3 py-1.5 bg-orange-600 text-white text-[10px] font-bold rounded shadow-sm hover:bg-orange-700 transition-colors disabled:opacity-70"
                                            >
                                                {reset2FAMutation.isPending ? "در حال انجام..." : "بله، بازنشانی"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Actions (Hidden when checkbox is checked) */}
                                    <div className="flex items-center justify-between gap-4 peer-checked:hidden" id="security-actions">
                                        <label className="px-4 py-2 border border-border-light dark:border-border-dark text-text-secondary-light hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2" htmlFor="reset-2fa-trigger">
                                            <span className="material-symbols-outlined text-sm">restart_alt</span>
                                            بازنشانی 2FA
                                        </label>
                                        {/* Disable button is visual only per requirements for now, or could map to reset */}
                                    </div>
                                </div>
                            ) : (
                                 <button
                                    onClick={() => router.push('/setup-2fa')}
                                    className="w-full py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">add_security</span>
                                    فعال‌سازی 2FA
                                </button>
                            )}
                        </div>

                        <hr className="border-border-light dark:border-border-dark"/>

                        {/* Active Sessions */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-text-primary-light dark:text-text-primary-dark">نشست‌های فعال</h4>
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-border-light dark:border-border-dark">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-text-secondary-light">desktop_windows</span>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold">مرورگر فعلی</p>
                                        <p className="text-[9px] text-text-secondary-light" dir="ltr">IP: (Current)</p>
                                    </div>
                                </div>
                                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded">همین الان</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-between text-text-secondary-light">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">support_agent</span>
                    <span className="text-xs">نیاز به راهنمایی دارید؟ با پشتیبانی تماس بگیرید.</span>
                </div>
                <p className="text-[10px]" dir="ltr">v3.4.2-stable</p>
            </div>
        </div>
    </div>
  );
}
