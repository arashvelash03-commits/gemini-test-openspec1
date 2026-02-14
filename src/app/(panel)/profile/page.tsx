"use client";

import { trpc } from "@/app/_trpc/client";

export default function ProfilePage() {
  const { data: profile, isLoading } = trpc.profile.getProfile.useQuery();
  const reset2FAMutation = trpc.profile.reset2FA.useMutation();



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
              console.log("Reset 2FA button clicked");
              if (window.confirm("You will be logged out and will have to log in again.")) {
                console.log("User confirmed");
              } else {
                console.log("User cancelled");
              }
            }}
            disabled={reset2FAMutation.isPending}
          >
            {reset2FAMutation.isPending ? "Resetting..." : "Reset 2FA"}
          </button>
        </div>
      )}
    </div>
  );
}
