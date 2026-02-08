"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import UserProfileForm from "./UserProfileForm";
import OrganizationForm from "./OrganizationForm";
import { ToastNotification } from "@/components/ui/ToastNotification";
import type { ProfileClientProps } from "@/lib/types";

export default function ProfileClient({
  user,
  organization,
}: ProfileClientProps) {
  const t = useTranslations();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  return (
    <div className="space-y-6 bg-background">
      {/* Toast Notification */}
      {toast && <ToastNotification message={toast.message} type={toast.type} />}

      {/* Page Header */}
      <div>
        <h3 className="text-lg font-medium text-foreground">
          {t("Profile.title")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("Profile.personalInfoDesc")}
        </p>
      </div>

      {/* Forms Grid */}
      <div className="border-t border-border pt-6 grid grid-cols-1 2xl:grid-cols-2 gap-8">
        <UserProfileForm user={user} />
        <OrganizationForm user={user} organization={organization} />
      </div>
    </div>
  );
}
