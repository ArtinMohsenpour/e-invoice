import { Check, AlertCircle } from "lucide-react";
import type { ToastNotificationProps } from "@/lib/types";

export function ToastNotification({ message, type }: ToastNotificationProps) {
  const isSuccess = type === "success";
  const Icon = isSuccess ? Check : AlertCircle;

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-md flex items-center gap-2 animate-in slide-in-from-right-10 ${
        isSuccess
          ? "bg-green-50/90 border-green-200 text-green-800 dark:bg-green-900/90 dark:border-green-800 dark:text-green-100"
          : "bg-red-50/90 border-red-200 text-red-800 dark:bg-red-900/90 dark:border-red-800 dark:text-red-100"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
