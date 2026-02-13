"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/app/_trpc/client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { profileSchema, passwordSchema, ProfileFormValues, PasswordFormValues } from "./profile-schema";
import { useRouter } from "next/navigation";

export function ProfileView() {
  const router = useRouter();
  const { data: session } = useSession();
  const utils = trpc.useUtils();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | '2fa'>('profile');

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
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(null), 3000);
    },
  });

  const reset2FAMutation = trpc.profile.reset2FA.useMutation({
      onSuccess: () => {
          setSuccessMessage("تنظیمات دو مرحله‌ای بازنشانی شد. لطفا مجددا فعال‌سازی کنید.");
          setTimeout(() => {
              router.push("/setup-2fa");
          }, 2000);
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
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">

      {/* Header Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-light to-primary/20 flex items-center justify-center text-primary text-2xl font-bold shadow-sm border border-primary/20">
            {profileData?.fullName?.[0] || "U"}
        </div>
        <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{profileData?.fullName}</h1>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">badge</span>
                {session?.user?.role === 'admin' ? 'مدیر سیستم' : session?.user?.role === 'doctor' ? 'پزشک متخصص' : 'کارشناس پذیرش'}
            </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6 overflow-x-auto">
        <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
            مشخصات فردی
        </button>
        <button
            onClick={() => setActiveTab('password')}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'password' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
            تغییر رمز عبور
        </button>
        <button
            onClick={() => setActiveTab('2fa')}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === '2fa' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
            امنیت دو مرحله‌ای
        </button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined">check_circle</span>
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined">error</span>
          {errorMessage}
        </div>
      )}

      {/* Profile Form */}
      {activeTab === 'profile' && (
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8 transition-all">
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">نام و نام خانوادگی</label>
              <div className="relative">
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                  <input
                    {...profileForm.register("fullName")}
                    className="w-full h-11 pr-10 pl-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    disabled={updateProfileMutation.isPending}
                  />
              </div>
              {profileForm.formState.errors.fullName && <p className="text-xs text-red-500">{profileForm.formState.errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">کد ملی</label>
              <div className="relative">
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">fingerprint</span>
                  <input
                    {...profileForm.register("nationalCode")}
                    className="w-full h-11 pr-10 pl-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-mono tracking-wider"
                    disabled={updateProfileMutation.isPending}
                  />
              </div>
              {profileForm.formState.errors.nationalCode && <p className="text-xs text-red-500">{profileForm.formState.errors.nationalCode.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">شماره موبایل</label>
              <div className="relative">
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">smartphone</span>
                  <input
                    {...profileForm.register("phoneNumber")}
                    className="w-full h-11 pr-10 pl-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-mono tracking-wider"
                    disabled={updateProfileMutation.isPending}
                  />
              </div>
              {profileForm.formState.errors.phoneNumber && <p className="text-xs text-red-500">{profileForm.formState.errors.phoneNumber.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">تاریخ تولد</label>
                <div className="relative">
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">calendar_today</span>
                    <input
                        {...profileForm.register("birthDate")}
                        type="date"
                        className="w-full h-11 pr-10 pl-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        disabled={updateProfileMutation.isPending}
                    />
                </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="px-8 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {updateProfileMutation.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </div>
        </form>
      </div>
      )}

      {/* Password Form */}
      {activeTab === 'password' && (
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8 transition-all">
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6 max-w-lg">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">کلمه عبور فعلی</label>
              <div className="relative">
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                  <input
                    type="password"
                    {...passwordForm.register("currentPassword")}
                    className="w-full h-11 pr-10 pl-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    disabled={changePasswordMutation.isPending}
                  />
              </div>
              {passwordForm.formState.errors.currentPassword && <p className="text-xs text-red-500">{passwordForm.formState.errors.currentPassword.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">کلمه عبور جدید</label>
              <div className="relative">
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">key</span>
                  <input
                    type="password"
                    {...passwordForm.register("newPassword")}
                    className="w-full h-11 pr-10 pl-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    disabled={changePasswordMutation.isPending}
                  />
              </div>
              {passwordForm.formState.errors.newPassword && <p className="text-xs text-red-500">{passwordForm.formState.errors.newPassword.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">تکرار کلمه عبور جدید</label>
              <div className="relative">
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">check_circle</span>
                  <input
                    type="password"
                    {...passwordForm.register("confirmPassword")}
                    className="w-full h-11 pr-10 pl-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    disabled={changePasswordMutation.isPending}
                  />
              </div>
              {passwordForm.formState.errors.confirmPassword && <p className="text-xs text-red-500">{passwordForm.formState.errors.confirmPassword.message}</p>}
            </div>

            <div className="flex justify-end pt-4">
                <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="px-8 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                {changePasswordMutation.isPending ? "در حال تغییر..." : "تغییر کلمه عبور"}
                </button>
            </div>
        </form>
      </div>
      )}

      {/* 2FA Section */}
      {activeTab === '2fa' && (
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8 transition-all">
          <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${profileData?.totpEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          <span className="material-symbols-outlined text-2xl">verified_user</span>
                      </div>
                      <div>
                          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">وضعیت تایید دو مرحله‌ای</h3>
                          <p className={`text-sm font-medium ${profileData?.totpEnabled ? 'text-emerald-600' : 'text-slate-500'}`}>
                              {profileData?.totpEnabled ? 'فعال و محافظت شده' : 'غیرفعال'}
                          </p>
                      </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                      تایید دو مرحله‌ای (2FA) لایه امنیتی اضافه‌ای است که از دسترسی غیرمجاز به حساب کاربری شما جلوگیری می‌کند. در صورت فراموشی یا تغییر دستگاه، می‌توانید آن را بازنشانی کنید.
                  </p>

                  {profileData?.totpEnabled ? (
                      <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-2">بازنشانی تنظیمات</h4>
                          <p className="text-xs text-slate-500 mb-4">در صورت مفقودی تلفن همراه یا مشکل در ورود، می‌توانید تنظیمات را بازنشانی کرده و مجدداً فعال‌سازی کنید.</p>
                          <button
                            onClick={() => {
                                if(confirm("آیا از بازنشانی تنظیمات امنیتی اطمینان دارید؟ این عمل قابل بازگشت نیست.")) {
                                    reset2FAMutation.mutate();
                                }
                            }}
                            className="text-red-600 hover:text-red-700 text-sm font-bold flex items-center gap-1 hover:bg-red-50 p-2 rounded-lg transition-colors"
                            disabled={reset2FAMutation.isPending}
                          >
                              <span className="material-symbols-outlined text-lg">history</span>
                              {reset2FAMutation.isPending ? "در حال بازنشانی..." : "بازنشانی و غیرفعال‌سازی"}
                          </button>
                      </div>
                  ) : (
                      <button
                        onClick={() => router.push('/setup-2fa')}
                        className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg shadow-lg shadow-primary/20 font-bold text-sm flex items-center gap-2 transition-all"
                      >
                          <span className="material-symbols-outlined">add_security</span>
                          فعال‌سازی تایید دو مرحله‌ای
                      </button>
                  )}
              </div>
              <div className="hidden md:block w-1/3 opacity-80">
                  <span className="material-symbols-outlined text-[150px] text-slate-200 dark:text-slate-700">security</span>
              </div>
          </div>
      </div>
      )}

    </div>
  );
}
