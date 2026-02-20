"use client";

import { trpc } from "@/app/_trpc/client";
import { useState } from "react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/index";

type RouterOutput = inferRouterOutputs<AppRouter>;
type AuditLogEntry = RouterOutput["admin"]["getAuditLogs"]["logs"][number];

export default function AuditLogsView() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = trpc.admin.getAuditLogs.useQuery({ page, limit: 50 });
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const logs = data?.logs || [];
  const totalPages = data?.totalPages || 1;
  const totalCount = data?.total || 0;

  const toggleDetails = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
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
          <div className="flex items-center gap-4">
             <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 shadow-sm">
                تعداد کل: {totalCount}
             </div>
             {/* Pagination Controls */}
             <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
                <span className="text-xs text-slate-600 font-mono w-20 text-center">
                    {page} / {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                    className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>
             </div>
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
                        {logs.map((log) => (
                            <LogRows
                                key={log.id}
                                log={log}
                                isExpanded={expandedLogId === log.id}
                                onToggle={() => toggleDetails(log.id)}
                            />
                        ))}
                        {logs.length === 0 && (
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

function LogRows({ log, isExpanded, onToggle }: { log: AuditLogEntry, isExpanded: boolean, onToggle: () => void }) {
    // Prefer actorDetails if available
    const actorDetails = log.actorDetails as { name?: string; role?: string } | null;
    const displayName = actorDetails?.name || log.actorName || "سیستم/ناشناس";
    const displayRole = actorDetails?.role || log.actorRole || "-";

    return (
        <>
            <tr className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600" dir="ltr">
                    {new Date(log.occurredAt).toLocaleString('fa-IR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-800">{displayName}</span>
                        <span className="text-xs text-slate-400">{displayRole}</span>
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
