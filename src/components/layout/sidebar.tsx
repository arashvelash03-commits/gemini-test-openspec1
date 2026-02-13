"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "../auth/logout-button";

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role;

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

  const links = [
    // Doctor & Clerk & Admin
    {
      name: "داشبورد",
      href: "/dashboard",
      icon: "dashboard",
      roles: ["admin", "doctor", "clerk", "patient"],
    },
    // Doctor & Clerk (Patient Management)
    {
      name: "لیست بیماران",
      href: "/patients",
      icon: "personal_injury", // or 'groups' or 'ward'
      roles: ["doctor", "clerk"],
    },
    // Admin Only
    {
      name: "مدیریت کاربران",
      href: "/admin/users",
      icon: "manage_accounts",
      roles: ["admin"],
    },
    // Profile (Everyone) - Though usually accessed via Header/Settings too
    {
      name: "پروفایل",
      href: "/profile",
      icon: "person",
      roles: ["admin", "doctor", "clerk", "patient"],
    },
  ];

  const filteredLinks = links.filter((link) => link.roles.includes(role || ""));

  return (
    <aside className="w-64 bg-white border-l border-slate-200 h-screen flex flex-col hidden md:flex sticky top-0">
      <div className="p-6 border-b border-slate-100 flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-primary">health_and_safety</span>
        <span className="mr-2 font-black text-xl text-slate-800">سامانه سلامت</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive(link.href)
                ? "bg-primary/10 text-primary font-bold shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span className={`material-symbols-outlined ${isActive(link.href) ? "text-primary" : "text-slate-400"}`}>
              {link.icon}
            </span>
            <span>{link.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-slate-50 rounded-xl border border-slate-100">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            {session?.user?.name?.[0] || "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-slate-800 truncate">{session?.user?.name || "کاربر"}</p>
            <p className="text-xs text-slate-500 truncate capitalize">
                {role === 'doctor' ? 'پزشک' : role === 'clerk' ? 'منشی' : role === 'admin' ? 'مدیر' : role}
            </p>
          </div>
        </div>
        <LogoutButton className="w-full justify-center border border-red-100 hover:border-red-200 bg-red-50 hover:bg-red-100" />
      </div>
    </aside>
  );
}
