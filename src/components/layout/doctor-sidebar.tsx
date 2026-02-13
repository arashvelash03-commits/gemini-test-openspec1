"use client";

export function DoctorSidebar() {
  return (
    <aside className="w-80 border-e border-border-light dark:border-border-dark bg-white dark:bg-gray-900 hidden lg:flex flex-col flex-none h-screen sticky top-0 overflow-hidden">
        <div className="p-4 border-b border-border-light dark:border-border-dark flex-none">
            <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary">smart_toy</span>
                <h2 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                    دستیار هوشمند
                </h2>
            </div>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                هر سوالی که می‌خواهید بپرسید، از اینجا شروع کنید.
            </p>
        </div>
        <div className="flex-1 bg-gray-50/50 dark:bg-gray-800/20 p-4 flex flex-col justify-center items-center text-center text-text-secondary-light dark:text-text-secondary-dark overflow-y-auto">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl opacity-20">chat_bubble</span>
            </div>
            <p className="text-sm font-medium mb-1">گفتگو با هوش مصنوعی</p>
        </div>
        <div className="p-4 border-t border-border-light dark:border-border-dark bg-white dark:bg-gray-900 flex-none overflow-y-auto max-h-[40%]">
            <h3 className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-3">
                پیشنهادات هوش مصنوعی
            </h3>
            <div className="space-y-3">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-lg flex gap-3 items-start">
                    <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-sm mt-0.5">lightbulb</span>
                    <p className="text-xs text-green-900 dark:text-green-200 leading-relaxed">
                        BRCA2 برای غربالگری خانواده را در نظر بگیرید.
                    </p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg flex gap-3 items-start shadow-sm">
                    <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark text-sm mt-0.5">medical_information</span>
                    <p className="text-xs text-text-primary-light dark:text-text-primary-dark leading-relaxed">
                        تایید رعایت برنامه شیمی‌درمانی.
                    </p>
                </div>
            </div>
        </div>
        <div className="p-4 border-t border-border-light dark:border-border-dark bg-white dark:bg-gray-900 flex-none">
            <div className="h-32 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center justify-center text-center">
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    دست‌خط
                </p>
            </div>
        </div>
    </aside>
  );
}
