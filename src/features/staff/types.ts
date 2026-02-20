export interface Staff {
  id: string;
  fullName: string | null;
  nationalCode: string;
  phoneNumber: string | null;
  role: "clerk";
  status: "active" | "inactive" | "error" | null;
  gender?: "male" | "female" | "other" | "unknown" | null;
  birthDate?: string | null;
}
