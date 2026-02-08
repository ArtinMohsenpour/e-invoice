import { useState, useCallback, useTransition } from "react";

export type ToastType = "success" | "error";

export interface Toast {
  message: string;
  type: ToastType;
}

export interface UseFormStateReturn {
  isPending: boolean;
  success: boolean;
  toast: Toast | null;
  showToast: (message: string, type: ToastType) => void;
  setSuccess: (success: boolean) => void;
  clearToast: () => void;
  startTransition: (callback: () => Promise<void>) => void;
}

export function useFormState(): UseFormStateReturn {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    isPending,
    success,
    toast,
    showToast,
    setSuccess,
    clearToast,
    startTransition: (callback) => {
      startTransition(async () => {
        await callback();
      });
    },
  };
}
