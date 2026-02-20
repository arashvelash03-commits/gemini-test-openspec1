"use client";

import { trpc } from "@/app/_trpc/client";
import { useState } from "react";

export default function AuditLogsView() {
  const { data: logs, isLoading, error } = trpc.admin.getAuditLogs.useQuery();
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const toggleDetails = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="mr-3 text-slate-500">در حال دریافت اطلاعات...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <span className="material-symbols-outlined mr-2">error</span>
        خطا در دریافت اطلاعات: {error.message}
      </div>
    );
  }

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden">
      <section className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">security</span>
              گزارش‌های امنیتی
            </h1>
            <p className="text-slate-500">مشاهده و بررسی فعالیت‌های کاربران در سیستم</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 shadow-sm">
            تعداد رکورد: {logs?.length || 0}
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto px-8 pb-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-right border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">زمان وقوع</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">کاربر</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">نوع عملیات</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">منبع</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">آدرس IP</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">جزئیات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {logs?.map((log) => (
                            <LogRows
                                key={log.id}
                                log={log}
                                isExpanded={expandedLogId === log.id}
                                onToggle={() => toggleDetails(log.id)}
                            />
                        ))}
                        {logs?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="material-symbols-outlined text-4xl text-slate-300">history_edu</span>
                                        <p>هیچ گزارشی یافت نشد.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </section>
    </div>
  );
}

function LogRows({ log, isExpanded, onToggle }: { log: any, isExpanded: boolean, onToggle: () => void }) {
    return (
        <>
            <tr className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600" dir="ltr">
                    {new Date(log.occurredAt).toLocaleString('fa-IR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-800">{log.actorName || "سیستم/ناشناس"}</span>
                        <span className="text-xs text-slate-400">{log.actorRole || "-"}</span>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold inline-flex items-center gap-1 ${
                        log.action.includes("create") ? "bg-green-100 text-green-700" :
                        log.action.includes("update") ? "bg-blue-100 text-blue-700" :
                        log.action.includes("delete") ? "bg-red-100 text-red-700" :
                        "bg-slate-100 text-slate-700"
                    }`}>
                        {log.action}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <div className="flex flex-col">
                        <span>{log.resourceType}</span>
                        <span className="text-xs text-slate-400 font-mono" dir="ltr">{log.resourceId?.slice(0, 8)}...</span>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500" dir="ltr">
                    {log.ipAddress || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                        onClick={onToggle}
                        className="text-primary hover:text-primary-dark transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                        {isExpanded ? "بستن" : "مشاهده"}
                        <span className={`material-symbols-outlined text-sm transition-transform ${isExpanded ? "rotate-180" : ""}`}>expand_more</span>
                    </button>
                </td>
            </tr>
            {isExpanded && (
                <tr className="bg-slate-50/50">
                    <td colSpan={6} className="px-6 py-4">
                        <div className="bg-white rounded-lg p-4 text-xs font-mono text-slate-700 border border-slate-200 shadow-inner overflow-x-auto" dir="ltr">
                            <pre>{JSON.stringify(log.details, null, 2)}</pre>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}
