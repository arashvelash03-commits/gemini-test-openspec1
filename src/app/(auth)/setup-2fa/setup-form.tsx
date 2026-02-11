"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogoutButton } from "@/components/auth/logout-button";
import { useSession } from "next-auth/react";

export default function Setup2FAForm() {
  const router = useRouter();
  const { update } = useSession();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const generateMutation = trpc.totp.generateTotpSecret.useMutation({
    onSuccess: async (data) => {
      // If backend says already enabled, force redirect immediately
      if (data.alreadyEnabled) {
          await update({ totpEnabled: true });
          window.location.href = "/dashboard";
          return;
      }
      setQrCodeUrl(data.qrCodeUrl);
      setSecret(data.secret);
    },
    onError: (err) => {
      setError("خطا در دریافت کد QR. لطفا مجددا تلاش کنید.");
      console.error(err);
    },
  });

  const verifyMutation = trpc.totp.verifyAndEnableTotp.useMutation({
    onSuccess: async () => {
      await update({ totpEnabled: true });
      window.location.href = "/dashboard";
    },
    onError: (err) => {
        if(err.message === "Invalid token") {
            setError("کد وارد شده صحیح نمی‌باشد.");
        } else {
            setError("خطا در تایید کد. لطفا مجددا تلاش کنید.");
        }
      console.error(err);
      setLoading(false);
    },
  });

  useEffect(() => {
    generateMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("کد باید ۶ رقم باشد.");
      return;
    }
    setError("");
    setLoading(true);
    verifyMutation.mutate({ token: code });
  };

  return (
    <div className="w-full max-w-sm relative">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 mb-2">فعال‌سازی تایید دو مرحله‌ای</h2>
        <p className="text-slate-500 text-sm">برای افزایش امنیت حساب کاربری کادر درمانی، این مرحله الزامی است.</p>
      </div>

      <div className="flex justify-center mb-8">
         {/* QR Code Container */}
        <div className="p-4 bg-white border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center w-48 h-48">
          {qrCodeUrl ? (
            <Image
              alt="QR Code"
              src={qrCodeUrl}
              width={160}
              height={160}
              className="grayscale hover:grayscale-0 transition-all duration-300"
            />
          ) : (
            <div className="text-slate-400 text-sm">
              {generateMutation.isPending ? "در حال تولید..." : "خطا در دریافت QR"}
            </div>
          )}
        </div>
      </div>

      {secret && (
        <div className="mb-8">
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">کد پشتیبان (در صورت عدم اسکن)</label>
          <div className="flex items-center gap-2 p-1 bg-slate-50 border border-slate-200 rounded-lg group focus-within:border-primary transition-colors">
            <code className="flex-1 text-center font-mono text-slate-700 font-bold tracking-[0.2em] py-2 truncate" dir="ltr">
              {secret}
            </code>
            <button
              className="p-2 text-slate-400 hover:text-primary hover:bg-emerald-50 rounded-md transition-all flex items-center shrink-0"
              title="کپی کردن کد"
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(secret);
                alert("کد کپی شد!");
              }}
            >
              <span className="material-symbols-outlined text-xl">content_copy</span>
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center">{error}</div>}

          <div>
            <label className="block text-center text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">کد تایید ۶ رقمی</label>
            <div className="relative">
                <input
                    className="w-full h-14 text-center text-2xl font-bold bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all tracking-[0.5em] font-numbers placeholder:tracking-normal placeholder:font-sans placeholder:text-slate-300"
                    maxLength={6}
                    placeholder="------"
                    type="text"
                    value={code}
                    onChange={(e) => {
                         const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
                         setCode(val);
                    }}
                    disabled={loading}
                    dir="ltr"
                />
            </div>
          </div>

        <button
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold h-14 rounded-xl shadow-lg shadow-primary/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading || code.length !== 6}
        >
          <span>{loading ? "در حال بررسی..." : "تایید و فعال‌سازی"}</span>
          {!loading && <span className="material-symbols-outlined text-xl">verified_user</span>}
        </button>
      </form>

      <div className="mt-8 flex flex-col items-center gap-4 border-t border-slate-100 pt-6">
        <button className="text-sm text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-lg">help</span>
            دریافت راهنمایی
        </button>

        <LogoutButton className="text-xs text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent !p-0" />
      </div>
    </div>
  );
}
