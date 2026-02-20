"use client";

import { trpc } from "@/app/_trpc/client";

export default function ProfilePage() {
  const { data: profile, isLoading } = trpc.profile.getProfile.useQuery();
  const reset2FAMutation = trpc.profile.reset2FA.useMutation({
    onSuccess: () => {
      alert("2FA با موفقیت بازنشانی شد. شما از سیستم خارج می‌شوید.");
      window.location.href = "/api/auth/signout";
    },
    onError: (err) => {
      alert("خطا: " + err.message);
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {profile && (
        <div>
          <p>
            <strong>Full Name:</strong> {profile.fullName}
          </p>
          <p>
            <strong>National Code:</strong> {profile.nationalCode}
          </p>
          <p>
            <strong>Phone Number:</strong> {profile.phoneNumber}
          </p>
          <p>
            <strong>2FA Enabled:</strong> {profile.totpEnabled ? "Yes" : "No"}
          </p>
          <button
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              if (window.confirm("با بازنشانی 2FA از سیستم خارج می‌شوید. ادامه می‌دهید؟")) {
                const password = window.prompt("لطفا رمز عبور خود را برای تایید وارد کنید:");
                if (password) {
                  reset2FAMutation.mutate({ password });
                }
              }
            }}
            disabled={reset2FAMutation.isPending}
          >
            {reset2FAMutation.isPending ? "در حال بازنشانی..." : "بازنشانی 2FA"}
          </button>
        </div>
      )}
    </div>
  );
}
