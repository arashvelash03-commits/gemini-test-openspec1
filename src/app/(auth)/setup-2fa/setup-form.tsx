"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Setup2FAForm() {
  const router = useRouter();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const generateMutation = trpc.totp.generateTotpSecret.useMutation({
    onSuccess: (data) => {
      setQrCodeUrl(data.qrCodeUrl);
      setSecret(data.secret);
    },
    onError: (err) => {
      setError("خطا در دریافت کد QR. لطفا مجددا تلاش کنید.");
      console.error(err);
    },
  });

  const verifyMutation = trpc.totp.verifyAndEnableTotp.useMutation({
    onSuccess: () => {
      // Refresh session?
      router.push("/dashboard");
      router.refresh();
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

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Allow only numbers and limit to 6
      const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
      setCode(val);
  };


  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 mb-2">فعال‌سازی تایید دو مرحله‌ای</h2>
        <p className="text-slate-500 text-sm">برای افزایش امنیت حساب کاربری کادر درمانی، این مرحله الزامی است.</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="p-4 bg-white border-2 border-dashed border-slate-200 rounded-2xl">
          {qrCodeUrl ? (
            <Image
              alt="QR Code"
              src={qrCodeUrl}
              width={160}
              height={160}
              className="grayscale hover:grayscale-0 transition-all duration-300"
            />
          ) : (
            <div className="w-40 h-40 flex items-center justify-center bg-slate-50 text-slate-400">
              {generateMutation.isPending ? "در حال بارگذاری..." : "خطا"}
            </div>
          )}
        </div>
      </div>

      {secret && (
        <div className="mb-8">
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">کد پشتیبان (در صورت عدم اسکن)</label>
          <div className="flex items-center gap-2 p-1 bg-slate-50 border border-slate-200 rounded-lg group focus-within:border-primary transition-colors">
            <code className="flex-1 text-center font-mono text-slate-700 font-bold tracking-[0.2em] py-2" dir="ltr">
              {secret}
            </code>
            <button
              className="p-2 text-slate-400 hover:text-primary hover:bg-emerald-50 rounded-md transition-all flex items-center"
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

      <form onSubmit={handleSubmit}>
        <div className="mb-10">
          <label className="block text-center text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">کد تایید ۶ رقمی</label>
          {error && <div className="text-red-500 text-sm text-center mb-2">{error}</div>}
          <div className="flex justify-center" dir="ltr">
             <input
                className="w-full h-14 text-center text-xl font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all tracking-[1em]"
                maxLength={6}
                placeholder="------"
                type="text"
                value={code}
                onChange={handleCodeChange}
                disabled={loading}
             />
          </div>
        </div>

        <button
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading || code.length !== 6}
        >
          <span>{loading ? "در حال بررسی..." : "تایید و فعال‌سازی"}</span>
          {!loading && <span className="material-symbols-outlined text-xl">verified_user</span>}
        </button>
      </form>

      <div className="mt-6 flex justify-center">
        <button className="text-sm text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-lg">help</span>
            دریافت راهنمایی
        </button>
      </div>
    </div>
  );
}
