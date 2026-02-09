"use client";

import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";

export default function UserManagementView() {
  const router = useRouter();
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
  const usersQuery = trpc.admin.getUsers.useQuery();

  const createUserMutation = trpc.admin.createUser.useMutation({
    onSuccess: () => {
      setSuccess("کاربر با موفقیت ایجاد شد");
      resetForm();
      utils.admin.getUsers.invalidate();
      setTimeout(() => setSuccess(""), 3000);
    },
    onError: (err) => {
      setError(err.message);
      setTimeout(() => setError(""), 5000);
    },
  });

  const updateUserMutation = trpc.admin.updateUser.useMutation({
    onSuccess: () => {
        setSuccess("اطلاعات کاربر با موفقیت ویرایش شد");
        resetForm();
        utils.admin.getUsers.invalidate();
        setTimeout(() => setSuccess(""), 3000);
    },
    onError: (err) => {
        setError(err.message);
        setTimeout(() => setError(""), 5000);
    }
  });

  const deactivateUserMutation = trpc.admin.deactivateUser.useMutation({
      onSuccess: () => {
          utils.admin.getUsers.invalidate();
      },
      onError: (err) => {
          alert("خطا در غیرفعال‌سازی کاربر: " + err.message);
      }
  });

  const resetForm = () => {
      setFormData({
        fullName: "",
        nationalCode: "",
        phoneNumber: "",
        role: "doctor",
        password: "",
      });
      setEditingId(null);
      setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
        updateUserMutation.mutate({
            id: editingId,
            fullName: formData.fullName,
            nationalCode: formData.nationalCode,
            phoneNumber: formData.phoneNumber,
        });
    } else {
        if (!formData.fullName || !formData.nationalCode || !formData.phoneNumber || !formData.password) {
            setError("لطفا همه فیلدها را پر کنید");
            return;
        }
        createUserMutation.mutate(formData);
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden h-screen bg-slate-50">
      {/* Users List Section (Right side in RTL) */}
      <section className="w-full md:w-[65%] flex flex-col bg-slate-50 border-l border-slate-200 h-full">
        <div className="p-6 pb-2 flex justify-between items-center bg-white border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">کاربران فعال</h2>
            <p className="text-xs text-slate-500 mt-1">لیست تمامی پزشکان و کارکنان دارای دسترسی</p>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input
              className="pr-9 pl-4 py-2 bg-white border border-slate-200 rounded-lg text-xs w-64 focus:ring-primary focus:border-primary outline-none"
              placeholder="جستجوی نام یا کد ملی..."
              type="text"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-4 custom-scrollbar space-y-3">
            {usersQuery.isLoading ? (
                <div className="text-center py-10 text-slate-500">در حال بارگذاری...</div>
            ) : usersQuery.data?.length === 0 ? (
                <div className="text-center py-10 text-slate-500">کاربری یافت نشد.</div>
            ) : (
                usersQuery.data?.map((user) => (
                    <div key={user.id} className={`p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between ${user.status === 'inactive' ? 'bg-slate-100 opacity-75 grayscale' : 'bg-white'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${user.role === 'doctor' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                <span className="material-symbols-outlined">{user.role === 'doctor' ? 'medical_services' : 'badge'}</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-slate-800">{user.fullName}</h3>
                                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${user.role === 'doctor' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {user.role === 'doctor' ? 'پزشک' : 'منشی'}
                                    </span>
                                    {user.status === 'inactive' && <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] rounded-full font-bold">غیرفعال</span>}
                                </div>
                                <p className="text-xs text-slate-500 font-numbers mt-1">کد ملی: {user.nationalCode} • همراه: {user.phoneNumber}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    setEditingId(user.id);
                                    setFormData({
                                        fullName: user.fullName || "",
                                        nationalCode: user.nationalCode,
                                        phoneNumber: user.phoneNumber || "",
                                        role: user.role as "doctor" | "clerk",
                                        password: "",
                                    });
                                    setError("");
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-xs font-medium border border-slate-100"
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
