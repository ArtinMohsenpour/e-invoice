"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo } from "react";
import { updateUserProfile } from "@/app/[locale]/(frontend)/actions/profile";
import { Loader2, User as UserIcon } from "lucide-react";
import { SaveSuccessIndicator } from "@/components/ui/SaveSuccessIndicator";
import { useFormState } from "@/lib/hooks/useFormState";
import { ProfileSchema, type ProfileInput } from "@/lib/validators";
import type { UserProfileFormProps } from "@/lib/types";

const UserProfileForm = memo(function UserProfileForm({
  user,
}: UserProfileFormProps) {
  const t = useTranslations();
  const { isPending, success, showToast, setSuccess, startTransition } =
    useFormState();

  const userForm = useForm<ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phoneNumber: user.phoneNumber || "",
    },
  });

  const onSubmit = (data: ProfileInput) => {
    setSuccess(false);
    startTransition(async () => {
        console.log("Submitting user profile data:", data);
      const result = await updateUserProfile(user.id, data);
      if (!result.success) {
        showToast(result.error as string, "error");
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card text-card-foreground p-6 shadow-sm h-fit">
      <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
        <div className="p-2 bg-primary/10 text-primary rounded-lg">
          <UserIcon size={20} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            {t("Profile.personalInfo")}
          </h2>
        </div>
      </div>

      <form onSubmit={userForm.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t("fields.firstName")}
            </label>
            <input
              {...userForm.register("firstName")}
              disabled={isPending}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
            />
            {userForm.formState.errors.firstName && (
              <p className="text-xs text-destructive">
                {userForm.formState.errors.firstName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t("fields.lastName")}
            </label>
            <input
              {...userForm.register("lastName")}
              disabled={isPending}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
            />
            {userForm.formState.errors.lastName && (
              <p className="text-xs text-destructive">
                {userForm.formState.errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t("fields.email")}
            </label>
            <input
              value={user.email}
              disabled
              className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed opacity-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t("fields.phoneNumber")}
            </label>
            <input
              {...userForm.register("phoneNumber")}
              disabled={isPending}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
            />
            {userForm.formState.errors.phoneNumber && (
              <p className="text-xs text-destructive">
                {userForm.formState.errors.phoneNumber.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <div className="relative flex items-center">
            <SaveSuccessIndicator
              isVisible={success}
              message={t("Settings.savedSuccessfully")}
            />
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {isPending && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              {t("Profile.saveChanges")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
});

export default UserProfileForm;
