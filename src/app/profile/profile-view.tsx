"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { signOut } from "next-auth/react";

interface ProfileData {
  fullName: string | null;
  nationalCode: string;
  phoneNumber: string | null;
  totpEnabled: boolean | null;
  birthDate: string | null;
}

const profileSchema = z.object({
  fullName: z.string().min(3, "نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد"),
  nationalCode: z.string().length(10, "کد ملی باید ۱۰ رقم باشد").regex(/^\d+$/, "کد ملی باید فقط شامل اعداد باشد"),
  phoneNumber: z.string().min(11, "شماره همراه باید ۱۱ رقم باشد").regex(/^09\d{9}$/, "شماره همراه معتبر نیست (مثلا ۰۹۱۲۳۴۵۶۷۸۹)"),
  birthDate: z.string().optional().or(z.literal("")),
});

export default function ProfileView() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    nationalCode: "",
    phoneNumber: "",
    birthDate: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const profileQuery = trpc.profile.getProfile.useQuery(undefined);

  const updateProfileMutation = trpc.profile.updateProfile.useMutation({
    onSuccess: () => {
      setSuccessMessage("اطلاعات کاربری با موفقیت بروزرسانی شد");
      setError("");
      profileQuery.refetch();
    },
    onError: (err) => {
      setError(err.message);
      setSuccessMessage("");
    },
  });

  const changePasswordMutation = trpc.profile.changePassword.useMutation({
    onSuccess: () => {
      setSuccessMessage("کلمه عبور با موفقیت تغییر کرد");
      setError("");
      setPasswordData({ currentPassword: "", newPassword: "" });
    },
    onError: (err) => {
      setError(err.message);
      setSuccessMessage("");
    },
  });

  const reset2FAMutation = trpc.profile.reset2FA.useMutation({
      onSuccess: () => {
          // 6. Logout user on reset 2FA
          signOut({ callbackUrl: "/login" });
      }
  });

  useEffect(() => {
    if (profileQuery.data) {
      setProfile(profileQuery.data);
      setFormData({
        fullName: profileQuery.data.fullName || "",
        nationalCode: profileQuery.data.nationalCode || "",
        phoneNumber: profileQuery.data.phoneNumber || "",
        birthDate: profileQuery.data.birthDate || "",
      });
    }
  }, [profileQuery.data]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      // 4. Clear success message on change
      if (successMessage) setSuccessMessage("");
      if (error) setError("");
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
      e.preventDefault();

      // 3. Zod Validation
      const result = profileSchema.safeParse(formData);
      if (!result.success) {
          setError(result.error.errors[0].message);
          return;
      }

      updateProfileMutation.mutate({
          fullName: formData.fullName || undefined,
          nationalCode: formData.nationalCode || undefined,
          phoneNumber: formData.phoneNumber || undefined,
          birthDate: formData.birthDate || undefined,
      });
  };

  if (profileQuery.isLoading) return <div className="p-8 text-center text-slate-500">در حال بارگذاری...</div>;
  if (profileQuery.isError) return <div className="p-8 text-center text-red-500">خطا در دریافت اطلاعات: {profileQuery.error.message}</div>;

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 bg-gray-50 dark:bg-slate-900/50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">تنظیمات حساب کاربری</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">اطلاعات شخصی و امنیت حساب خود را مدیریت کنید.</p>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
        {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{successMessage}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. Left Container (in RTL, second child) -> Security Card (Swapped Order) */}

          {/* Security Card (Now displayed on Right in RTL if grid auto-flow isn't overridden, wait...)
              RTL: Col 1 is Right, Col 2 is Left.
              User wants Profile Forms in Left Container.
              So Profile Card needs to be the 2nd child in DOM.
              So Security Card should be 1st child.
          */}

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-fit">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                  <span className="material-symbols-outlined">security</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">امنیت و ورود</h3>
                  <p className="text-[10px] text-slate-500">گذرواژه و احراز هویت دومرحله‌ای</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <form onSubmit={(e) => {
                  e.preventDefault();
                  if (passwordData.newPassword.length < 8) {
                      setError("کلمه عبور جدید باید حداقل ۸ کاراکتر باشد");
                      return;
                  }
                  changePasswordMutation.mutate({
                      currentPassword: passwordData.currentPassword,
                      newPassword: passwordData.newPassword,
                  });
              }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">تغییر گذرواژه</h4>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <input
                    className="w-full text-sm bg-gray-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2 border"
                    placeholder="گذرواژه فعلی"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => {
                        setPasswordData({ ...passwordData, currentPassword: e.target.value });
                        if(successMessage) setSuccessMessage("");
                    }}
                  />
                  <input
                    className="w-full text-sm bg-gray-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2 border"
                    placeholder="گذرواژه جدید"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => {
                        setPasswordData({ ...passwordData, newPassword: e.target.value });
                        if(successMessage) setSuccessMessage("");
                    }}
                  />

                  <div className="flex justify-between items-center mt-2">
                      {/* 5. Forgot Password Link/Button */}
                      <button
                        type="button"
                        className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 transition-colors"
                        onClick={() => alert("لینک بازیابی کلمه عبور به ایمیل/پیامک شما ارسال شد (نمایشی)")}
                      >
                          <span className="material-symbols-outlined text-sm">lock_reset</span>
                          فراموشی رمز عبور؟
                      </button>

                      <button
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50"
                        type="submit"
                        disabled={changePasswordMutation.isPending}
                      >
                        {changePasswordMutation.isPending ? "..." : "تغییر رمز"}
                      </button>
                  </div>
                </div>
              </form>

              <hr className="border-slate-200 dark:border-slate-700"/>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">احراز هویت دو مرحله‌ای (2FA)</h4>
                    {profile?.totpEnabled ? (
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-[9px] font-bold rounded-full">فعال</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-900/40 text-gray-700 dark:text-gray-400 text-[9px] font-bold rounded-full">غیرفعال</span>
                    )}
                  </div>
                  <span className={`material-symbols-outlined text-lg ${profile?.totpEnabled ? "text-green-500" : "text-gray-400"}`}>verified_user</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  برای امنیت بیشتر، در هر بار ورود علاوه بر رمز عبور، کدی به شماره همراه شما پیامک می‌شود.
                </p>

                <div className="flex items-center justify-between gap-4">
                  {profile?.totpEnabled ? (
                    <button
                      className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-gray-50 dark:hover:bg-slate-800 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 w-full justify-center"
                      onClick={() => {
                          if(confirm("آیا مطمئن هستید که می‌خواهید تنظیمات 2FA را بازنشانی کنید؟ شما از حساب خارج خواهید شد.")) {
                              reset2FAMutation.mutate();
                          }
                      }}
                      disabled={reset2FAMutation.isPending}
                    >
                      <span className="material-symbols-outlined text-sm">restart_alt</span>
                      {reset2FAMutation.isPending ? "در حال بازنشانی..." : "بازنشانی 2FA"}
                    </button>
                  ) : (
                    <button
                      className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 w-full justify-center"
                      onClick={() => router.push("/setup-2fa")}
                    >
                      <span className="material-symbols-outlined text-sm">add_moderator</span>
                      فعال‌سازی 2FA
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info Card (Now 2nd Child -> Left in RTL) */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-fit">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">اطلاعات کاربری</h3>
                  <p className="text-[10px] text-slate-500">مشخصات فردی و تماس</p>
                </div>
              </div>
            </div>
            <form onSubmit={handleProfileUpdate} className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">نام و نام خانوادگی</label>
                <input
                  className="w-full text-sm bg-gray-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2 border"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">کد ملی</label>
                <input
                  className="w-full text-sm bg-gray-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2 border font-numbers"
                  type="text"
                  value={formData.nationalCode}
                  onChange={(e) => handleInputChange("nationalCode", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">شماره همراه</label>
                <input
                  className="w-full text-sm bg-gray-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary text-left p-2 border font-numbers"
                  dir="ltr"
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                />
              </div>
              {/* 2. Birthday Field */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">تاریخ تولد</label>
                <input
                  className="w-full text-sm bg-gray-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2 border font-numbers"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange("birthDate", e.target.value)}
                />
              </div>

              <div className="pt-2">
                <button
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm shadow-emerald-200 dark:shadow-none disabled:opacity-50"
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
