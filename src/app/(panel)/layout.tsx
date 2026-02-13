"use client";

import { useSession } from "next-auth/react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { DoctorSidebar } from "@/components/layout/doctor-sidebar";
import { ClerkSidebar } from "@/components/layout/clerk-sidebar";
import { PortalSidebar } from "@/components/layout/portal-sidebar";
import { Sidebar as GenericSidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
      return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  const role = session?.user?.role;

  let SidebarComponent = GenericSidebar;

  if (role === "admin") SidebarComponent = AdminSidebar;
  else if (role === "doctor") SidebarComponent = DoctorSidebar;
  else if (role === "clerk") SidebarComponent = ClerkSidebar;
  else if (role === "patient") SidebarComponent = PortalSidebar;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans" dir="rtl">
      <SidebarComponent />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
