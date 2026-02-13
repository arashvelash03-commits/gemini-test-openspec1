"use client";

import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Forgot Password
            </h1>
            <p className="text-slate-500 text-sm">
              This feature is not yet implemented.
            </p>
            <div className="mt-8">
              <Link
                className="text-sm text-slate-500 hover:text-primary transition-colors font-medium"
                href="/login"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
