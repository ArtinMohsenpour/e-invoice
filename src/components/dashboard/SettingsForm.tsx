"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "@/i18n/routing";
import { updateUserPreferences } from "@/app/[locale]/(frontend)/actions/settings";
import { Loader2, Check, ChevronDown } from "lucide-react";
import type { User } from "@/payload-types";

interface SettingsFormProps {
  user: User;
}

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}

function CustomSelect({ value, onChange, options }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <div className="relative mt-1" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 w-full max-w-2xs items-center justify-between rounded-lg border border-foreground/20 bg-background px-4 py-2 text-sm transition-all hover:border-accent-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          className={`h-4 w-4 opacity-50 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full max-w-2xs overflow-hidden rounded-lg border border-input bg-card p-1 shadow-lg animate-in fade-in zoom-in-95">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="relative flex w-full cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm outline-none transition-colors hover:bg-foreground/10 hover:text-accent-foreground"
            >
              <span className="flex-1 truncate">{option.label}</span>
              {value === option.value && <Check className="ml-2 h-4 w-4" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function SettingsForm({ user }: SettingsFormProps) {
  const t = useTranslations("Settings");
  const { setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    language: user.language || "en",
    theme: user.theme || "system",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setSuccess(false);

    // Optimistic updates
    if (formData.theme !== "system") {
      setTheme(formData.theme as string);
    }

    // Server update
    const result = await updateUserPreferences(user.id, {
      theme: formData.theme as "light" | "dark" | "system",
      language: formData.language as "en" | "de",
    });

    if (result.success) {
      setSuccess(true);
      // If language changed, redirect
      if (formData.language !== user.language) {
        router.replace(pathname, { locale: formData.language as "en" | "de" });
      }
    }

    setIsPending(false);
  };

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "de", label: "Deutsch" },
  ];

  const themeOptions = [
    { value: "light", label: t("themeLight") },
    { value: "dark", label: t("themeDark") },
    { value: "system", label: t("themeSystem") },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {t("languageLabel")}
          </label>
          <CustomSelect
            value={formData.language}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                language: value as "en" | "de",
              }))
            }
            options={languageOptions}
          />
          <p className="text-sm text-muted-foreground">
            {t("languageDescription")}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {t("themeLabel")}
          </label>
          <CustomSelect
            value={formData.theme}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                theme: value as "light" | "dark" | "system",
              }))
            }
            options={themeOptions}
          />
          <p className="text-sm text-muted-foreground">
            {t("themeDescription")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("saveChanges")}
        </button>

        {success && (
          <div className="flex items-center text-sm text-green-600 animate-in fade-in slide-in-from-left-2">
            <Check className="mr-1 h-4 w-4" />
            {t("savedSuccessfully")}
          </div>
        )}
      </div>
    </form>
  );
}
