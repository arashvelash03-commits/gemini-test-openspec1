"use client";

import { useState } from "react";

interface PatientGroupProps {
  title: string;
  count: string;
  icon: string;
  color: string;
  expanded?: boolean;
  children: React.ReactNode;
}

function PatientGroup({ title, count, icon, color, expanded = true, children }: PatientGroupProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  return (
    <div className="border-b border-border-light dark:border-border-dark">
      <div
        className="patient-group-header group flex justify-between items-center py-2 px-2 cursor-pointer text-text-primary-light dark:text-text-primary-dark font-semibold"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-1">
          <span className={`material-symbols-outlined ${color} text-base`}>{icon}</span>
          <span className="font-bold text-sm">{title}</span>
          <span className="text-xs text-text-secondary-light">({count})</span>
        </div>
        <span className={`material-symbols-outlined text-text-secondary-light transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>expand_less</span>
      </div>
      <div className={`patient-group-content transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 py-0"}`}>
        {children}
      </div>
    </div>
  );
}

export function ClerkSidebar() {
  return (
    <aside className="flex-none w-64 lg:w-72 flex flex-col bg-card-light dark:bg-card-dark border-l border-border-light dark:border-border-dark shadow-sm h-screen sticky top-0 overflow-hidden">
      <div className="p-2 border-b border-border-light dark:border-border-dark flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-xl">group</span>
        <h2 className="font-bold text-base text-text-primary-light dark:text-text-primary-dark">لیست بیماران (۴۸)</h2>
        <button className="bg-primary hover:bg-primary-dark text-white text-xs px-2 py-1 rounded-md shadow-sm flex items-center gap-1 mr-auto transition-colors">
          <span className="material-symbols-outlined text-base">person_add</span>
          جدید
        </button>
      </div>

      <div className="p-2 border-b border-border-light dark:border-border-dark">
        <div className="relative">
          <input
            className="w-full bg-background-light dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg h-9 px-2 pl-8 text-xs focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-text-secondary-light text-text-primary-light dark:text-text-primary-dark"
            placeholder="جستجوی بیمار، کد ملی..."
            type="text"
          />
          <span className="material-symbols-outlined absolute left-2 top-2 text-text-secondary-light text-[18px]">search</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          <button className="flex-none px-1.5 py-1 rounded-full text-[10px] font-medium bg-primary-light text-primary-dark border border-primary/30 dark:bg-primary-dark/20 dark:text-primary-light hover:bg-primary/20 dark:hover:bg-primary-dark/30 transition-colors whitespace-nowrap">همه (48)</button>
          <button className="flex-none px-1.5 py-1 rounded-full text-[10px] font-medium bg-gray-50 text-text-secondary-light border border-border-light dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors whitespace-nowrap">ویزیت (3)</button>
          <button className="flex-none px-1.5 py-1 rounded-full text-[10px] font-medium bg-gray-50 text-text-secondary-light border border-border-light dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors whitespace-nowrap">پذیرش (5)</button>
          <button className="flex-none px-1.5 py-1 rounded-full text-[10px] font-medium bg-gray-50 text-text-secondary-light border border-border-light dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors whitespace-nowrap">نوبت (40)</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <PatientGroup title="در حال ویزیت" count="۳" icon="play_circle" color="text-status-current">
          <div className="px-2 py-2 flex items-center gap-1.5 border-t border-dashed border-border-light dark:border-border-dark bg-primary-light/30 dark:bg-primary-dark/10 hover:bg-primary-light/50 dark:hover:bg-primary-dark/20 cursor-pointer transition-colors">
            <div className="relative flex-none">
              <div className="w-9 h-9 rounded-full bg-white dark:bg-gray-800 text-primary flex items-center justify-center font-bold text-xs shadow-sm overflow-hidden">
                <span className="material-symbols-outlined text-3xl">account_circle</span>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary border border-white dark:border-card-dark"></span>
              </span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark">علی صادقی</p>
              <p className="text-[9px] text-primary-dark dark:text-primary-light font-medium flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[11px]">timer</span>
                ۰۵:۳۲ در ویزیت
              </p>
            </div>
            <button className="bg-[#94a3b8] hover:bg-slate-500 text-white text-[10px] px-2 py-1 rounded-md shadow-sm flex items-center gap-0.5 transition-all">
              پایان ویزیت
            </button>
          </div>

           <div className="px-2 py-2 flex items-center gap-1.5 border-t border-dashed border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
            <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 flex items-center justify-center font-bold text-xs flex-none">MS</div>
            <div className="flex-1">
                <p className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark">مهسا سلیمانی</p>
                <p className="text-[9px] text-text-secondary-light font-medium flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[11px]">timer</span>
                    ۱۵:۰۳ در ویزیت
                </p>
            </div>
            <button className="bg-[#94a3b8] hover:bg-slate-500 text-white text-[10px] px-2 py-1 rounded-md shadow-sm flex items-center gap-0.5 transition-all">
                پایان ویزیت
            </button>
          </div>
           <div className="px-2 py-2 flex items-center gap-1.5 border-t border-dashed border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
            <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 flex items-center justify-center font-bold text-xs flex-none">HR</div>
            <div className="flex-1">
                <p className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark">حامد رسولی</p>
                <p className="text-[9px] text-text-secondary-light font-medium flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[11px]">timer</span>
                    ۰۲:۱۰ در ویزیت
                </p>
            </div>
            <button className="bg-[#94a3b8] hover:bg-slate-500 text-white text-[10px] px-2 py-1 rounded-md shadow-sm flex items-center gap-0.5 transition-all">
                پایان ویزیت
            </button>
          </div>
        </PatientGroup>

        <PatientGroup title="منتظر پذیرش" count="۵" icon="door_front" color="text-status-arrived">
             <div className="px-2 py-2 flex items-center gap-1.5 border-t border-dashed border-border-light dark:border-border-dark bg-status-arrived/10 dark:bg-status-arrived/20 hover:bg-status-arrived/20 dark:hover:bg-status-arrived/30 cursor-pointer transition-colors">
                <div className="w-9 h-9 rounded-full bg-white dark:bg-gray-800 text-status-arrived flex items-center justify-center font-bold text-xs shadow-sm border border-status-arrived/20 flex-none">MH</div>
                <div className="flex-1">
                    <p className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark">محمد حسینی</p>
                    <p className="text-[9px] text-status-arrived font-medium flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[11px]">timer</span>
                        ۰۸:۱۲ در انتظار
                    </p>
                </div>
                <button className="bg-primary hover:bg-primary-dark text-white text-[10px] px-2 py-1 rounded-md shadow-sm flex items-center gap-0.5 transition-colors">
                    شروع ویزیت
                </button>
            </div>
        </PatientGroup>

        <PatientGroup title="نوبت‌دار" count="۴۰" icon="event_note" color="text-status-scheduled">
            <div className="px-2 py-2 flex items-center gap-1.5 border-t border-dashed border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
                <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 flex items-center justify-center font-bold text-xs flex-none">ZK</div>
                <div className="flex-1">
                    <p className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark">زهرا کاظمی</p>
                    <p className="text-[9px] text-text-secondary-light">نوبت: ۱۰:۴۵</p>
                </div>
                <button className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-[10px] px-2 py-1 rounded-md shadow-sm transition-colors whitespace-nowrap">
                    اعلام حضور
                </button>
            </div>
        </PatientGroup>
      </div>
    </aside>
  );
}
