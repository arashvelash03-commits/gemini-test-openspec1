"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/app/_trpc/client";
import { useEffect, useState } from "react";

const profileSchema = z.object({
  fullName: z.string().min(2, "نام کامل باید حداقل ۲ حرف باشد"),
  nationalCode: z.string().length(10, "کد ملی باید ۱۰ رقم باشد"),
  phoneNumber: z.string().length(11, "شماره موبایل باید ۱۱ رقم باشد"),
  birthDate: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileView() {
  const utils = trpc.useUtils();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      nationalCode: "",
      phoneNumber: "",
      birthDate: "",
    },
  });

  useEffect(() => {
    if (profileData) {
      form.reset({
        fullName: profileData.fullName || "",
        nationalCode: profileData.nationalCode || "",
        phoneNumber: profileData.phoneNumber || "",
        birthDate: profileData.birthDate || "",
      });
    }
  }, [profileData, form]);

  const onSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-text-secondary-light">در حال بارگذاری...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
        <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">person</span>
          مشخصات کاربری
        </h2>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm border border-green-200 dark:border-green-800">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800">
            {errorMessage}
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">نام و نام خانوادگی</label>
              <input
                {...form.register("fullName")}
                className="w-full px-3 py-2 bg-background-light dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                disabled={updateProfileMutation.isPending}
              />
              {form.formState.errors.fullName && (
                <p className="text-xs text-red-500">{form.formState.errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">کد ملی</label>
              <input
                {...form.register("nationalCode")}
                className="w-full px-3 py-2 bg-background-light dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                disabled={true}
              />
              {form.formState.errors.nationalCode && (
                <p className="text-xs text-red-500">{form.formState.errors.nationalCode.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">شماره موبایل</label>
              <input
                {...form.register("phoneNumber")}
                className="w-full px-3 py-2 bg-background-light dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                disabled={updateProfileMutation.isPending}
              />
              {form.formState.errors.phoneNumber && (
                <p className="text-xs text-red-500">{form.formState.errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">تاریخ تولد</label>
                <input
                    {...form.register("birthDate")}
                    type="date"
                    className="w-full px-3 py-2 bg-background-light dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    disabled={updateProfileMutation.isPending}
                />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border-light dark:border-border-dark">
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              {updateProfileMutation.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
