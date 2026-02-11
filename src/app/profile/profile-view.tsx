"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";

interface ProfileData {
  fullName: string | null;
  nationalCode: string;
  phoneNumber: string | null;
  totpEnabled: boolean | null;
}

export default function ProfileView() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    nationalCode: "",
    phoneNumber: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const profileQuery = trpc.profile.getProfile.useQuery(undefined, {
      // Don't rely on onSuccess here to set state if possible, as it might flicker or not run on refetch
      // Better to use useEffect on data change
  });

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
          setSuccessMessage("تنظیمات 2FA بازنشانی شد");
          profileQuery.refetch();
      }
  });

  useEffect(() => {
    if (profileQuery.data) {
      setProfile(profileQuery.data);
      setFormData({
        fullName: profileQuery.data.fullName || "",
        nationalCode: profileQuery.data.nationalCode || "",
        phoneNumber: profileQuery.data.phoneNumber || "",
      });
    }
  }, [profileQuery.data]);

  // Use profileQuery.isLoading directly
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
          {/* Profile Info Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
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
            <form onSubmit={(e) => {
                e.preventDefault();
                updateProfileMutation.mutate({
                    fullName: formData.fullName || undefined,
                    nationalCode: formData.nationalCode || undefined,
                    phoneNumber: formData.phoneNumber || undefined,
                });
            }} className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">نام و نام خانوادگی</label>
                <input
                  className="w-full text-sm bg-gray-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2 border"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">کد ملی</label>
                <input
                  className="w-full text-sm bg-gray-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2 border"
                  type="text"
                  value={formData.nationalCode}
                  onChange={(e) => setFormData({ ...formData, nationalCode: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">شماره همراه</label>
                <input
                  className="w-full text-sm bg-gray-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary text-left p-2 border"
                  dir="ltr"
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
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

          {/* Security Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
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
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
                  <input
                    className="w-full text-sm bg-gray-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary p-2 border"
                    placeholder="گذرواژه جدید"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                  <button
                    className="text-right text-xs text-blue-600 font-medium hover:underline self-end"
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                  >
                    {changePasswordMutation.isPending ? "در حال تغییر..." : "تغییر گذرواژه"}
                  </button>
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
                          if(confirm("آیا مطمئن هستید که می‌خواهید تنظیمات 2FA را بازنشانی کنید؟")) {
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
        </div>
      </div>
    </div>
  );
}
