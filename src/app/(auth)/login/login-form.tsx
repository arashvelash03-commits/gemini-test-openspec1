"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Link from "next/link";

const schema = z.object({
  identifier: z.string().min(1, "شماره همراه یا کد ملی الزامی است"),
  password: z.string().min(1, "کلمه عبور الزامی است"),
  totpCode: z.string().optional(),
});

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [requireTotp, setRequireTotp] = useState(false);
  const [credentials, setCredentials] = useState({ identifier: "", password: "" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    const submissionData = requireTotp ? {
        ...credentials,
        totpCode: data.totpCode
    } : data;

    const result = schema.safeParse(submissionData);
    if (!result.success) {
      setError(result.error.issues[0].message);
      setLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        identifier: result.data.identifier,
        password: result.data.password,
        ...(result.data.totpCode ? { totpCode: result.data.totpCode } : {}),
        redirect: false,
      });

      if (res?.error) {
        const errorMsg = res.error;
        const errorCode = res.code;

        if (errorMsg.includes("TOTP_REQUIRED") || errorCode === "TOTP_REQUIRED") {
            setRequireTotp(true);
            setCredentials({
                identifier: result.data.identifier as string,
                password: result.data.password as string,
            });
            setError("");
        } else if (errorMsg.includes("INVALID_TOTP") || errorCode === "INVALID_TOTP") {
            setError("کد تایید اشتباه است");
        } else if (errorMsg === "Configuration") {
             // Fallback for configuration errors (masked by NextAuth sometimes)
            setError("خطای سیستم. لطفا مجددا تلاش کنید.");
        } else {
            setError("اطلاعات وارد شده صحیح نمی‌باشد");
        }
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("خطایی رخ داده است");
    } finally {
      setLoading(false);
    }
  }

  const handleTotpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
      e.target.value = val;
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="p-8 pb-0 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
              <span className="material-symbols-outlined text-primary text-4xl">
                {requireTotp ? "verified_user" : "oncology"}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {requireTotp ? "تایید دو مرحله‌ای" : "ورود به سامانه"}
            </h1>
            <p className="text-slate-500 text-sm">
              {requireTotp ? "کد ۶ رقمی Google Authenticator را وارد کنید" : "لطفاً اطلاعات کاربری خود را وارد کنید"}
            </p>
          </div>
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div id="error-message" className="p-3 text-sm text-red-500 bg-red-50 rounded-xl text-center border border-red-100">
                  {error}
                </div>
              )}

              {!requireTotp ? (
              <>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block mr-1" htmlFor="identifier">
                  شماره همراه یا کد ملی
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                  <input
                    className="w-full h-12 pr-11 pl-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-numbers placeholder:font-sans placeholder:text-slate-400 focus:outline-none"
                    id="identifier"
                    name="identifier"
                    type="text"
                    disabled={loading}
                    autoFocus
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block mr-1" htmlFor="password">
                  کلمه عبور
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                  <input
                    className="w-full h-12 pr-11 pl-11 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-numbers placeholder:font-sans placeholder:text-slate-400 focus:outline-none"
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    disabled={loading}
                  />
                  <button
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
              </>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 block mr-1" htmlFor="totpCode">
                    کد تایید
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">key</span>
                    <input
                      className="w-full h-12 pr-11 pl-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-numbers placeholder:font-sans placeholder:text-slate-400 focus:outline-none text-center tracking-[1em] text-lg font-bold"
                      id="totpCode"
                      name="totpCode"
                      maxLength={6}
                      disabled={loading}
                      autoFocus
                      onChange={handleTotpChange}
                    />
                  </div>
                </div>
              )}

              <button
                className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                <span>{loading ? "در حال پردازش..." : (requireTotp ? "تایید و ورود" : "ورود")}</span>
              </button>

              {requireTotp && (
                  <button
                    type="button"
                    onClick={() => {
                        setRequireTotp(false);
                        setCredentials({ identifier: "", password: "" });
                        setError("");
                    }}
                    className="w-full text-sm text-slate-500 hover:text-primary mt-4 transition-colors flex items-center justify-center gap-1"
                  >
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      بازگشت به صفحه ورود
                  </button>
              )}

            </form>
            {!requireTotp && (
                <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                <Link
                    className="text-sm text-slate-500 hover:text-primary transition-colors font-medium"
                    href="#"
                >
                    فراموشی کلمه عبور؟
                </Link>
                </div>
            )}
          </div>
        </div>
        <p className="mt-8 text-center text-slate-400 text-xs">
          © سامانه مدیریت پرونده الکترونیک سلامت (EHR)
        </p>
      </div>
    </div>
  );
}
