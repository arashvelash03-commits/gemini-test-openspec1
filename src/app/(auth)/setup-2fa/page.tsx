import Setup2FAForm from "./setup-form";

export default function Setup2FA() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 md:p-0">
      <main className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[650px]">
        <section className="w-full md:w-5/12 bg-emerald-50 p-8 md:p-12 border-e border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                <span className="material-symbols-outlined text-2xl">shield_lock</span>
              </div>
              <h1 className="text-xl font-bold text-slate-800">امنیت حساب کاربری</h1>
            </div>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-none w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">۱</div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">نصب اپلیکیشن</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">اپلیکیشن Google Authenticator را از گوگل‌پلی یا اپ‌استور روی تلفن همراه خود نصب کنید.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-none w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">۲</div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">اسکن کد QR</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">وارد اپلیکیشن شوید و علامت (+) را بزنید، سپس کد QR مقابل را با دوربین گوشی اسکن نمایید.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-none w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">۳</div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">تایید نهایی</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">کد ۶ رقمی نمایش داده شده در اپلیکیشن را در کادر مربوطه وارد نمایید تا فعال‌سازی تکمیل شود.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 opacity-40 flex justify-center">
            <span className="material-symbols-outlined text-[120px] text-emerald-600">phonelink_lock</span>
          </div>
        </section>
        <section className="w-full md:w-7/12 p-8 md:p-16 flex flex-col items-center justify-center bg-white">
          <Setup2FAForm />
        </section>
      </main>

      <div className="absolute bottom-6 text-center w-full">
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em] flex items-center justify-center gap-2">
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          Medical Grade Security Protocol
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
        </p>
      </div>
    </div>
  );
}
