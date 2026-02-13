import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(2, "نام کامل باید حداقل ۲ حرف باشد"),
  nationalCode: z.string().length(10, "کد ملی باید ۱۰ رقم باشد"),
  phoneNumber: z.string().length(11, "شماره موبایل باید ۱۱ رقم باشد"),
  birthDate: z.string().optional(),
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, "کلمه عبور فعلی الزامی است"),
  newPassword: z.string().min(6, "کلمه عبور جدید باید حداقل ۶ کاراکتر باشد"),
  confirmPassword: z.string().min(6, "تکرار کلمه عبور جدید الزامی است"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "کلمه عبور جدید و تکرار آن مطابقت ندارند",
  path: ["confirmPassword"],
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type PasswordFormValues = z.infer<typeof passwordSchema>;
