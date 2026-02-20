"use client";

import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { Staff } from "../types";
import StaffForm from "./StaffForm";

// Simple Modal Component
function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "تایید",
  cancelText = "انصراف",
  isDestructive = false
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-600 leading-relaxed">{message}</p>
        </div>
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors text-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`px-4 py-2 text-white font-medium rounded-xl transition-colors text-sm shadow-lg ${isDestructive ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-primary hover:bg-primary-dark shadow-primary/20'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StaffManagementView() {
  const [editingId, setEditingId] = useState<string | null>(null);

  // Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDestructive?: boolean;
    confirmText?: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const utils = trpc.useUtils();

  const toggleStatusMutation = trpc.staff.toggleStaffStatus.useMutation({
      onSuccess: () => {
          utils.staff.getMyStaff.invalidate();
      }
  });

  const staffQuery = trpc.staff.getMyStaff.useQuery();

  const handleEdit = (staff: Staff) => {
      setEditingId(staff.id);
  };

  const confirmToggleStatus = (staff: Staff) => {
    const isDeactivating = staff.status === 'active' || staff.status === 'error';
    setModalState({
      isOpen: true,
      title: isDeactivating ? "غیرفعال‌سازی پرسنل" : "فعال‌سازی مجدد پرسنل",
      message: isDeactivating
        ? `آیا از غیرفعال‌سازی پرسنل ${staff.fullName} اطمینان دارید؟`
        : `آیا از فعال‌سازی مجدد پرسنل ${staff.fullName} اطمینان دارید؟`,
      confirmText: isDeactivating ? "غیرفعال‌سازی" : "فعال‌سازی",
      isDestructive: isDeactivating,
      onConfirm: () => toggleStatusMutation.mutate({ id: staff.id }),
    });
  };

  return (
    <div className="flex h-full overflow-hidden bg-slate-50">
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        isDestructive={modalState.isDestructive}
      />

      {/* Staff List Section */}
      <section className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">مدیریت پرسنل</h1>
            <p className="text-slate-500">مشاهده و مدیریت دسترسی‌های پرسنل مطب</p>
        </header>

        {staffQuery.isLoading && <div className="text-center py-12 text-slate-500">در حال بارگذاری لیست پرسنل...</div>}
        {staffQuery.isError && <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">خطا در دریافت لیست پرسنل</div>}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {staffQuery.data && (
                staffQuery.data.map((staff) => (
                    <div key={staff.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold bg-slate-100 text-slate-600`}
                            >
                                {staff.fullName ? staff.fullName[0] : "?"}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{staff.fullName || "نامشخص"}</h3>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                    <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100 font-numbers">{staff.nationalCode}</span>
                                    <span className="flex items-center gap-1">
                                        <span className={`w-1.5 h-1.5 rounded-full ${staff.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        {staff.role === 'clerk' ? 'منشی' : staff.role}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEdit(staff)}
                                className="flex items-center gap-1 px-3 py-1.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-xs font-medium border border-slate-100"
                            >
                                <span className="material-symbols-outlined text-sm">edit</span>
                                ویرایش
                            </button>
                            {staff.status === 'active' || staff.status === 'error' ? (
                                <button
                                    onClick={() => confirmToggleStatus(staff)}
                                    className="flex items-center gap-1 px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-xs font-medium border border-red-50"
                                >
                                    <span className="material-symbols-outlined text-sm">person_off</span>
                                    غیرفعال‌سازی
                                </button>
                            ) : (
                                <button
                                    onClick={() => confirmToggleStatus(staff)}
                                    className="flex items-center gap-1 px-3 py-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-xs font-medium border border-emerald-100"
                                >
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

      {/* Create/Edit User Form Section */}
      <StaffForm
        initialData={staffQuery.data?.find((s) => s.id === editingId)}
        onSuccess={() => {
            setEditingId(null);
            utils.staff.getMyStaff.invalidate();
        }}
        onCancel={() => setEditingId(null)}
      />
    </div>
  );
}
