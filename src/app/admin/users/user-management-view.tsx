"use client";

import { useState } from "react";
import { trpc } from "@/app/_trpc/client";

interface User {
  id: string;
  fullName: string | null;
  nationalCode: string;
  phoneNumber: string | null;
  role: "admin" | "doctor" | "clerk" | "patient";
  status: "active" | "inactive" | "error" | null;
}

export default function UserManagementView() {
  const [formData, setFormData] = useState({
    fullName: "",
    nationalCode: "",
    phoneNumber: "",
    role: "doctor" as "doctor" | "clerk",
    password: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const utils = trpc.useUtils();

  const createUserMutation = trpc.admin.createUser.useMutation({
    onSuccess: () => {
      setSuccess("کاربر با موفقیت ایجاد شد");
      setError("");
      resetForm();
      utils.admin.getUsers.invalidate();
    },
    onError: (err) => {
      setError(err.message);
      setSuccess("");
    },
  });

  const updateUserMutation = trpc.admin.updateUser.useMutation({
    onSuccess: () => {
      setSuccess("اطلاعات کاربر بروزرسانی شد");
      setError("");
      resetForm();
      utils.admin.getUsers.invalidate();
    },
    onError: (err) => {
      setError(err.message);
      setSuccess("");
    },
  });

  const deactivateUserMutation = trpc.admin.deactivateUser.useMutation({
      onSuccess: () => {
          utils.admin.getUsers.invalidate();
      }
  });

  const usersQuery = trpc.admin.getUsers.useQuery({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.fullName || !formData.nationalCode || !formData.phoneNumber) {
      setError("لطفا تمام فیلدها را پر کنید");
      return;
    }

    if (editingId) {
        updateUserMutation.mutate({
            id: editingId,
            fullName: formData.fullName,
            nationalCode: formData.nationalCode,
            phoneNumber: formData.phoneNumber,
        });
    } else {
        if (!formData.password) {
            setError("کلمه عبور الزامی است");
            return;
        }
        createUserMutation.mutate({
            fullName: formData.fullName,
            nationalCode: formData.nationalCode,
            phoneNumber: formData.phoneNumber,
            role: formData.role,
            password: formData.password,
        });
    }
  };

  const handleEdit = (user: User) => {
      setEditingId(user.id);
      setFormData({
          fullName: user.fullName || "",
          nationalCode: user.nationalCode,
          phoneNumber: user.phoneNumber || "",
          role: user.role === "doctor" || user.role === "clerk" ? user.role : "doctor", // Default to doctor if role is not editable/supported in form
          password: "", // Password not filled
      });
      setError("");
      setSuccess("");
  };

  const resetForm = () => {
      setEditingId(null);
      setFormData({
        fullName: "",
        nationalCode: "",
        phoneNumber: "",
        role: "doctor",
        password: "",
      });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* Users List Section (Right side in RTL) */}
      <section className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">مدیریت کاربران</h1>
            <p className="text-slate-500">مشاهده و مدیریت دسترسی‌های پرسنل سامانه</p>
        </header>

        {usersQuery.isLoading && <div className="text-center py-12 text-slate-500">در حال بارگذاری لیست کاربران...</div>}
        {usersQuery.isError && <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">خطا در دریافت لیست کاربران</div>}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {usersQuery.data && (
                usersQuery.data.map((user) => (
                    <div key={user.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
                                ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' :
                                  user.role === 'doctor' ? 'bg-blue-100 text-blue-600' :
                                  'bg-slate-100 text-slate-600'}`}
                            >
                                {user.fullName ? user.fullName[0] : "?"}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{user.fullName || "نامشخص"}</h3>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                    <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100 font-numbers">{user.nationalCode}</span>
                                    <span className="flex items-center gap-1">
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        {user.role === 'doctor' ? 'پزشک' : user.role === 'clerk' ? 'منشی' : user.role === 'admin' ? 'مدیر' : user.role}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEdit(user as User)}
                                className="flex items-center gap-1 px-3 py-1.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-xs font-medium border border-slate-100"
                            >
                                <span className="material-symbols-outlined text-sm">edit</span>
                                ویرایش
                            </button>
                            {user.status === 'active' || user.status === 'error' ? (
                                <button
                                    onClick={() => {
                                        if(confirm(`آیا از غیرفعال‌سازی کاربر ${user.fullName} اطمینان دارید؟`)) {
                                            deactivateUserMutation.mutate({ id: user.id });
                                        }
                                    }}
                                    className="flex items-center gap-1 px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-xs font-medium border border-red-50"
                                >
                                    <span className="material-symbols-outlined text-sm">person_off</span>
                                    غیرفعال‌سازی
                                </button>
                            ) : (
                                <button className="flex items-center gap-1 px-3 py-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-xs font-medium border border-emerald-100">
                                    <span className="material-symbols-outlined text-sm">person_check</span>
                                    فعال‌سازی مجدد
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
      </section>

      {/* Create/Edit User Form Section (Left side in RTL) */}
      <section className="w-full md:w-[35%] bg-white p-8 border-r border-slate-100 flex flex-col h-full overflow-y-auto">
        <div className="mb-8 flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{editingId ? "ویرایش کاربر" : "ثبت کاربر جدید"}</h2>
                <p className="text-sm text-slate-500">{editingId ? "ویرایش اطلاعات کاربر انتخاب شده." : "مشخصات پرسنل جدید را برای ایجاد دسترسی وارد نمایید."}</p>
            </div>
            {editingId && (
                <button
                    onClick={resetForm}
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
            <label className="text-sm font-semibold text-slate-700 block mr-1">نقش کاربری</label>
            <div className="grid grid-cols-2 gap-3">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="doctor"
                  checked={formData.role === 'doctor'}
                  onChange={() => setFormData({...formData, role: 'doctor'})}
                  className="hidden peer"
                  disabled={!!editingId} // Disable role change during edit (optional restriction)
                />
                <div className={`flex items-center justify-center gap-2 p-3 border border-slate-200 rounded-xl peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all ${editingId ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <span className="material-symbols-outlined text-xl">medical_services</span>
                  <span className="text-sm font-bold">پزشک</span>
                </div>
              </label>
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="clerk"
                  checked={formData.role === 'clerk'}
                  onChange={() => setFormData({...formData, role: 'clerk'})}
                  className="hidden peer"
                  disabled={!!editingId}
                />
                <div className={`flex items-center justify-center gap-2 p-3 border border-slate-200 rounded-xl peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all ${editingId ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
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
                onChange={(e) => setFormData({...formData, nationalCode: e.target.value})}
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
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                className="w-full h-12 pr-11 pl-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-numbers placeholder:font-sans placeholder:text-slate-400 outline-none"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              />
            </div>
          </div>

          {!editingId && (
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block mr-1" htmlFor="password">کلمه عبور موقت</label>
                <div className="relative">
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full h-12 pr-11 pl-11 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-numbers placeholder:font-sans placeholder:text-slate-400 outline-none"
                    placeholder="••••••••"
                />
                </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={createUserMutation.isPending || updateUserMutation.isPending}
              className="w-full h-14 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <span className="material-symbols-outlined">{editingId ? "save" : "person_add"}</span>
              <span>
                  {editingId
                    ? (updateUserMutation.isPending ? "در حال ذخیره..." : "ذخیره تغییرات")
                    : (createUserMutation.isPending ? "در حال ایجاد..." : "ایجاد حساب کاربری")
                  }
              </span>
            </button>
          </div>
        </form>

        <div className="mt-auto pt-6 border-t border-slate-50">
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl text-amber-800 border border-amber-100">
            <span className="material-symbols-outlined text-xl mt-0.5">info</span>
            <p className="text-[11px] leading-relaxed">
              {editingId
                ? "در حالت ویرایش، امکان تغییر نقش و کلمه عبور وجود ندارد. برای تغییر کلمه عبور، کاربر باید از بخش ورود اقدام کند."
                : "کلمه عبور موقت باید پس از اولین ورود توسط کاربر تغییر یابد. دسترسی‌های پیش‌فرض بر اساس نقش انتخابی تعیین می‌شود."
              }
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
