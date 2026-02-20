"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/app/_trpc/client";
import { Staff } from "../types";

interface StaffFormProps {
    initialData?: Staff | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function StaffForm({ initialData, onSuccess, onCancel }: StaffFormProps) {
    const [formData, setFormData] = useState({
        fullName: "",
        nationalCode: "",
        phoneNumber: "",
        role: "clerk" as const,
        password: "",
        gender: "male" as "male" | "female" | "other" | "unknown",
        birthDate: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Reset form when initialData changes (switching between create/edit or changing selected staff)
    useEffect(() => {
        if (initialData) {
            setFormData({
                fullName: initialData.fullName || "",
                nationalCode: initialData.nationalCode,
                phoneNumber: initialData.phoneNumber || "",
                role: "clerk",
                password: "", // Always clear password on edit
                gender: initialData.gender || "male",
                birthDate: initialData.birthDate || "",
            });
            // Clear messages when switching selected staff
            setError("");
            setSuccess("");
        } else {
            // Reset to default for create mode
            setFormData({
                fullName: "",
                nationalCode: "",
                phoneNumber: "",
                role: "clerk",
                password: "",
                gender: "male",
                birthDate: "",
            });
            // Note: We might want to keep success message if we just transitioned from edit->create after success
            // But usually switching to 'create new' manually should clear messages.
            // However, the parent resets editingId to null on success, triggering this effect.
            // If we clear success here, we lose the 'Updated' message.
            // So let's NOT clear success here if we are just resetting form?
            // But if user clicks "Cancel", we pass initialData=null.
            // Let's rely on the mutations to set success, and manual edits to clear them?
            // The original code reset form in resetForm(), and setSuccess BEFORE that.
            // Then resetForm() didn't clear success.
            // But handleEdit DID clear success.
            // So: Clear success if initialData is present (Edit Mode).
            // If initialData is null (Create Mode), we might have come from a success.
            // But if user clicks "Cancel", we want to clear.
            // Let's just clear error, and let success persist?
            // Or maybe only clear if we are explicitly entering edit mode.
        }
    }, [initialData?.id]); // Depend on ID to detect switch

    const createStaffMutation = trpc.staff.createStaff.useMutation({
        onSuccess: () => {
            setSuccess("پرسنل با موفقیت ایجاد شد");
            setError("");
            onSuccess();
        },
        onError: (err) => {
            setError(err.message);
            setSuccess("");
        },
    });

    const updateStaffMutation = trpc.staff.updateStaff.useMutation({
        onSuccess: () => {
            setSuccess("اطلاعات پرسنل بروزرسانی شد");
            setError("");
            onSuccess();
        },
        onError: (err) => {
            setError(err.message);
            setSuccess("");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!formData.fullName || !formData.nationalCode || !formData.phoneNumber) {
            setError("لطفا تمام فیلدها را پر کنید");
            return;
        }

        if (initialData) {
            updateStaffMutation.mutate({
                id: initialData.id,
                fullName: formData.fullName,
                nationalCode: formData.nationalCode,
                phoneNumber: formData.phoneNumber,
                gender: formData.gender,
                birthDate: formData.birthDate || undefined,
                password: formData.password || undefined,
            });
        } else {
            if (!formData.password) {
                setError("کلمه عبور الزامی است");
                return;
            }
            createStaffMutation.mutate({
                fullName: formData.fullName,
                nationalCode: formData.nationalCode,
                phoneNumber: formData.phoneNumber,
                role: "clerk",
                password: formData.password,
                gender: formData.gender,
                birthDate: formData.birthDate || undefined,
            });
        }
    };

    return (
        <section className="w-full md:w-[35%] bg-white p-8 border-r border-slate-100 flex flex-col h-full overflow-y-auto">
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{initialData ? "ویرایش پرسنل" : "ثبت پرسنل جدید"}</h2>
                    <p className="text-sm text-slate-500">{initialData ? "ویرایش اطلاعات پرسنل انتخاب شده." : "مشخصات پرسنل جدید را برای ایجاد دسترسی وارد نمایید."}</p>
                </div>
                {initialData && (
                    <button
                        onClick={onCancel}
                        className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded hover:bg-slate-200"
                    >
                        انصراف
                    </button>
                )}
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">{error}</div>}
            {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4 border border-green-100">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block mr-1" htmlFor="role-select">نقش کاربری</label>
                    <div className="grid grid-cols-1 gap-3" id="role-select">
                        <label className="cursor-pointer">
                            <input
                                type="radio"
                                name="role"
                                value="clerk"
                                checked={true}
                                readOnly
                                className="hidden peer"
                                disabled={!!initialData}
                            />
                            <div className="flex items-center justify-center gap-2 p-3 border border-slate-200 rounded-xl peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all">
                                <span className="material-symbols-outlined text-xl">person_pin</span>
                                <span className="text-sm font-bold">منشی</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block mr-1" htmlFor="fullname">نام و نام خانوادگی</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                        <input
                            id="fullname"
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full h-12 pr-11 pl-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none"
                            placeholder="مثلاً: علی رضایی"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block mr-1" htmlFor="national_id">کد ملی</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">id_card</span>
                        <input
                            id="national_id"
                            type="text"
                            value={formData.nationalCode}
                            onChange={(e) => setFormData({ ...formData, nationalCode: e.target.value })}
                            className="w-full h-12 pr-11 pl-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-numbers placeholder:font-sans placeholder:text-slate-400 outline-none"
                            placeholder="۱۰ رقم کد ملی"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block mr-1" htmlFor="phone">شماره همراه</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">phone_iphone</span>
                        <input
                            id="phone"
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            className="w-full h-12 pr-11 pl-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-numbers placeholder:font-sans placeholder:text-slate-400 outline-none"
                            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 block mr-1" htmlFor="gender">جنسیت</label>
                        <select
                            id="gender"
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value as "male" | "female" | "other" | "unknown" })}
                            className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none bg-white"
                        >
                            <option value="male">مرد</option>
                            <option value="female">زن</option>
                            <option value="other">سایر</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 block mr-1" htmlFor="birthdate">تاریخ تولد</label>
                        <input
                            id="birthdate"
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                            className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none font-numbers"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block mr-1" htmlFor="password">
                        {initialData ? "تغییر کلمه عبور (اختیاری)" : "کلمه عبور موقت"}
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                        <input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full h-12 pr-11 pl-11 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-numbers placeholder:font-sans placeholder:text-slate-400 outline-none"
                            placeholder={initialData ? "فقط در صورت نیاز به تغییر وارد کنید" : "••••••••"}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={createStaffMutation.isPending || updateStaffMutation.isPending}
                        className="w-full h-14 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        <span className="material-symbols-outlined">{initialData ? "save" : "person_add"}</span>
                        <span>
                            {initialData
                                ? (updateStaffMutation.isPending ? "در حال ذخیره..." : "ذخیره تغییرات")
                                : (createStaffMutation.isPending ? "در حال ایجاد..." : "ایجاد حساب کاربری")
                            }
                        </span>
                    </button>
                </div>
            </form>

            <div className="mt-auto pt-6 border-t border-slate-50">
                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl text-amber-800 border border-amber-100">
                    <span className="material-symbols-outlined text-xl mt-0.5">info</span>
                    <p className="text-[11px] leading-relaxed">
                        {initialData
                            ? "برای تغییر کلمه عبور، مقدار جدید را در فیلد مربوطه وارد کنید. در غیر این صورت فیلد را خالی بگذارید."
                            : "کلمه عبور موقت باید پس از اولین ورود توسط پرسنل تغییر یابد. دسترسی‌های پیش‌فرض بر اساس نقش انتخابی تعیین می‌شود."
                        }
                    </p>
                </div>
            </div>
        </section>
    );
}
