"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { LogoutButton } from "../auth/logout-button";

export function Header() {
  const { data: session } = useSession();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine profile link based on role
  const getProfileLink = () => {
    switch (session?.user?.role) {
      case "admin": return "/admin/profile";
      case "doctor": return "/doctors/profile";
      case "clerk": return "/clerks/profile";
      default: return "/profile";
    }
  };

  const getRoleLabel = () => {
    switch (session?.user?.role) {
      case "admin": return "مدیر سیستم";
      case "doctor": return "پزشک";
      case "clerk": return "منشی";
      case "patient": return "بیمار";
      default: return "کاربر";
    }
  };

  return (
    <header className="bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark flex-none z-30 shadow-sm w-full relative">
      <div className="w-full mx-auto relative bg-card-light dark:bg-card-dark z-40">
        <div className="flex flex-col md:flex-row items-center h-auto md:h-20 gap-4 md:gap-0 py-3 md:py-0 px-6">

          {/* Mobile Header (Simplified) */}
          <div className="flex items-center justify-between md:hidden w-full">
            <button className="text-text-secondary-light dark:text-text-secondary-dark p-1">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="flex flex-col items-center">
              <span className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark">{session?.user?.name || "کاربر مهمان"}</span>
              <span className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark">{getRoleLabel()}</span>
            </div>
            <button className="p-1 text-text-secondary-light dark:text-text-secondary-dark">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
          </div>

          {/* Desktop Left Section (User Info) */}
          <div className="hidden md:flex items-center gap-4 flex-none lg:w-72 h-full relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-px bg-border-light dark:bg-border-dark"></div>
            <div className="w-10 h-10 rounded-full bg-primary-light dark:bg-primary-dark/20 border border-primary/20 dark:border-primary/50 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-lg shadow-sm relative overflow-hidden">
                {session?.user?.image ? (
                    <img src={session.user.image} alt={session.user.name || "User"} className="w-full h-full object-cover" />
                ) : (
                    <span>{session?.user?.name?.[0]?.toUpperCase() || "U"}</span>
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-card-dark rounded-full"></span>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark whitespace-nowrap">
                {session?.user?.name || "کاربر مهمان"}
              </h1>
              <span className="text-[11px] font-medium text-text-secondary-light dark:text-text-secondary-dark">{getRoleLabel()}</span>
            </div>
          </div>

          {/* Desktop Right Section (Search & Actions) */}
          <div className="hidden md:flex flex-1 items-center justify-between h-full pl-0 pr-6">
            <div className="relative flex-1 max-w-lg mx-4">
              <input
                className="w-full bg-gray-50 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg h-10 px-4 pl-10 text-sm focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-400 text-text-primary-light dark:text-text-primary-dark"
                placeholder="جستجوی سریع بیمار، کدملی یا پرونده..."
                type="text"
              />
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[20px]">search</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-border-light dark:border-border-dark">
                <span className="material-symbols-outlined text-text-secondary-light text-[18px]">calendar_today</span>
                <span className="text-xs font-medium text-text-primary-light dark:text-text-primary-dark">
                    {new Date().toLocaleDateString('fa-IR')}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-border-light dark:border-border-dark">
                <span className="material-symbols-outlined text-text-secondary-light text-[18px]">schedule</span>
                <span className="text-xs font-medium text-text-primary-light dark:text-text-primary-dark">
                    {new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="w-px h-6 bg-border-light dark:bg-border-dark mx-1"></div>

              <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark transition-colors">
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-card-dark"></span>
              </button>

              <div className="relative" ref={settingsRef}>
                <button
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                >
                    <span className="material-symbols-outlined text-[22px]">settings</span>
                </button>

                {isSettingsOpen && (
                    <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg z-50 overflow-hidden">
                        <div className="p-2 border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800/50">
                            <p className="text-xs font-bold text-text-primary-light dark:text-text-primary-dark">تنظیمات سریع</p>
                        </div>
                        <div className="p-1">
                            <Link
                                href={getProfileLink()}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-text-primary-light dark:text-text-primary-dark transition-colors"
                                onClick={() => setIsSettingsOpen(false)}
                            >
                                <span className="material-symbols-outlined text-lg">person</span>
                                <span>پروفایل من</span>
                            </Link>

                            {session?.user?.role === "admin" && (
                                <Link
                                    href="/admin/users"
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-text-primary-light dark:text-text-primary-dark transition-colors"
                                    onClick={() => setIsSettingsOpen(false)}
                                >
                                    <span className="material-symbols-outlined text-lg">manage_accounts</span>
                                    <span>مدیریت کاربران</span>
                                </Link>
                            )}

                            <div className="border-t border-border-light dark:border-border-dark my-1"></div>

                            <LogoutButton className="w-full justify-start px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-red-600 dark:text-red-400 transition-colors" />
                        </div>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
