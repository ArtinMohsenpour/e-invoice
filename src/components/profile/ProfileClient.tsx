"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState, useEffect } from "react";
import {
  updateUserProfile,
  updateOrganization,
  deleteOrganization,
} from "@/app/[locale]/(frontend)/actions/profile";
import {
  Loader2,
  User as UserIcon,
  Building,
  AlertTriangle,
  Check,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { CountrySelector } from "@/components/ui/CountrySelector";
import type { ProfileClientProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ProfileSchema,
  OrganizationSchema,
  type ProfileInput,
  type OrganizationInput,
} from "@/lib/validators";

export default function ProfileClient({
  user,
  organization,
}: ProfileClientProps) {
  const t = useTranslations();
  const router = useRouter();
  const [isPendingUser, startTransitionUser] = useTransition();
  const [isPendingOrg, startTransitionOrg] = useTransition();
  const [isPendingDelete, startTransitionDelete] = useTransition();
  const [userSuccess, setUserSuccess] = useState(false);
  const [orgSuccess, setOrgSuccess] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (userSuccess) {
      const timer = setTimeout(() => setUserSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [userSuccess]);

  useEffect(() => {
    if (orgSuccess) {
      const timer = setTimeout(() => setOrgSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [orgSuccess]);

  // User Form
  const userForm = useForm<ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phoneNumber: user.phoneNumber || "",
    },
  });

  // Org Form
  const orgForm = useForm<OrganizationInput>({
    resolver: zodResolver(OrganizationSchema),
    defaultValues: {
      name: organization?.name || "",
      taxId: organization?.taxId || "",
      phoneNumber: organization?.phoneNumber || "",
      address: {
        street: organization?.address?.street || "",
        city: organization?.address?.city || "",
        zip: organization?.address?.zip || "",
        country: organization?.address?.country || "",
      },
    },
  });

  const onUserSubmit = (data: ProfileInput) => {
    setUserSuccess(false);
    startTransitionUser(async () => {
      const result = await updateUserProfile(user.id, data);
      if (!result.success) {
        showToast(result.error as string, "error");
      } else {
        setUserSuccess(true);
      }
    });
  };

  const onOrgSubmit = (data: OrganizationInput) => {
    setOrgSuccess(false);
    startTransitionOrg(async () => {
      const result = await updateOrganization(organization?.id || null, data);
      if (!result.success) {
        showToast(result.error as string, "error");
      } else {
        setOrgSuccess(true);
        // If creating for the first time, refresh to get the new state
        if (!organization) {
          router.refresh();
        }
      }
    });
  };

  const onDeleteOrg = () => {
    if (!organization) return;
    if (confirm(t("Profile.deleteOrgDesc"))) {
      startTransitionDelete(async () => {
        const result = await deleteOrganization(organization.id);
        if (result.success) {
          router.refresh();
          // Reset form
          orgForm.reset({
            name: "",
            taxId: "",
            phoneNumber: "",
            address: { street: "", city: "", zip: "", country: "" },
          });
          showToast("Organization deleted", "success");
        } else {
          showToast(result.error as string, "error");
        }
      });
    }
  };

  // If no organization, user is creating one, so they are effectively the "owner" of the process
  // Otherwise, strictly check if they are the 'owner'
  const canEditOrg = !organization || user.orgRole === "owner";
  const isOwner = user.orgRole === "owner";

  return (
    <div className="space-y-6 bg-background">
      {/* Toast Notification (Only for errors now, or general msgs) */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-md flex items-center gap-2 animate-in slide-in-from-right-10 ${
            toast.type === "success"
              ? "bg-green-50/90 border-green-200 text-green-800 dark:bg-green-900/90 dark:border-green-800 dark:text-green-100"
              : "bg-red-50/90 border-red-200 text-red-800 dark:bg-red-900/90 dark:border-red-800 dark:text-red-100"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="w-4 h-4" />
          ) : (
            <Shield className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-foreground">
          {t("Profile.title")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("Profile.personalInfoDesc")}
        </p>
      </div>

      <div className="border-t border-border pt-6 grid grid-cols-1 2xl:grid-cols-2 gap-8">
        {/* Group A: Personal Profile */}
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

          <form
            onSubmit={userForm.handleSubmit(onUserSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t("fields.firstName")}
                </label>
                <input
                  {...userForm.register("firstName")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <div className="relative flex items-center">
                <div
                  className={cn(
                    "absolute right-full top-1/2 -translate-y-1/2 mr-4 flex items-center gap-2 whitespace-nowrap text-sm font-medium text-green-600 transition-all duration-500 ease-in-out",
                    userSuccess
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-4 pointer-events-none"
                  )}
                >
                  <Check className="h-4 w-4" />
                  {t("Settings.savedSuccessfully")}
                </div>
                <button
                  type="submit"
                  disabled={isPendingUser}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  {isPendingUser && (
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  )}
                  {t("Profile.saveChanges")}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Group B: Organization / Company Settings */}
        <div className="  h-fit">
          <div className="rounded-xl border border-border text-card-foreground p-6 shadow-sm bg-card">
            <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <Building size={20} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  {t("Profile.companyInfo")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("Profile.companyInfoDesc")}
                </p>
              </div>
              {!canEditOrg && (
                <span className="ml-auto min-w-fit px-2 py-1 text-xs font-medium text-muted-foreground bg-muted rounded-full">
                  {t("Profile.readOnly")}
                </span>
              )}
            </div>
            <form
              onSubmit={orgForm.handleSubmit(onOrgSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {t("fields.orgName")}
                  </label>
                  <input
                    {...orgForm.register("name")}
                    disabled={!canEditOrg}
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                      orgForm.formState.errors.name &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                  />
                  {orgForm.formState.errors.name && (
                    <p className="text-xs text-destructive">
                      {orgForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {t("fields.taxId")}
                  </label>
                  <input
                    {...orgForm.register("taxId")}
                    disabled={!canEditOrg}
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                      orgForm.formState.errors.taxId &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                  />
                  {orgForm.formState.errors.taxId && (
                    <p className="text-xs text-destructive">
                      {orgForm.formState.errors.taxId.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t("fields.phoneNumber")}
                </label>
                <input
                  {...orgForm.register("phoneNumber")}
                  disabled={!canEditOrg}
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                    orgForm.formState.errors.phoneNumber &&
                      "border-destructive focus-visible:ring-destructive",
                  )}
                />
                {orgForm.formState.errors.phoneNumber && (
                  <p className="text-xs text-destructive">
                    {orgForm.formState.errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t("fields.street")}
                </label>
                <input
                  {...orgForm.register("address.street")}
                  disabled={!canEditOrg}
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                    orgForm.formState.errors.address?.street &&
                      "border-destructive focus-visible:ring-destructive",
                  )}
                />
                {orgForm.formState.errors.address?.street && (
                  <p className="text-xs text-destructive">
                    {orgForm.formState.errors.address.street.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {t("fields.city")}
                  </label>
                  <input
                    {...orgForm.register("address.city")}
                    disabled={!canEditOrg}
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                      orgForm.formState.errors.address?.city &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                  />
                  {orgForm.formState.errors.address?.city && (
                    <p className="text-xs text-destructive">
                      {orgForm.formState.errors.address.city.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {t("fields.zip")}
                  </label>
                  <input
                    {...orgForm.register("address.zip")}
                    disabled={!canEditOrg}
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                      orgForm.formState.errors.address?.zip &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                  />
                  {orgForm.formState.errors.address?.zip && (
                    <p className="text-xs text-destructive">
                      {orgForm.formState.errors.address.zip.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {t("fields.country")}
                  </label>
                  <div className="relative">
                    <CountrySelector
                      value={orgForm.watch("address.country")}
                      onChange={(val) =>
                        orgForm.setValue("address.country", val, {
                          shouldValidate: true,
                        })
                      }
                      disabled={!canEditOrg}
                      error={orgForm.formState.errors.address?.country?.message}
                    />
                    {orgForm.formState.errors.address?.country && (
                      <p className="text-xs text-destructive mt-1">
                        {orgForm.formState.errors.address.country.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {canEditOrg && (
                <div className="flex justify-end pt-4">
                  <div className="relative flex items-center">
                    <div
                      className={cn(
                        "absolute right-full top-1/2 -translate-y-1/2 mr-4 flex items-center gap-2 whitespace-nowrap text-sm font-medium text-green-600 transition-all duration-500 ease-in-out",
                        orgSuccess
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-4 pointer-events-none"
                      )}
                    >
                      <Check className="h-4 w-4" />
                      {t("Settings.savedSuccessfully")}
                    </div>
                    <button
                      type="submit"
                      disabled={isPendingOrg}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                      {isPendingOrg && (
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      )}
                      {t("Profile.saveChanges")}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
          {/* Danger Zone */}
          {isOwner && organization && (
            <div className="rounded-xl border mt-5 border-destructive/20 bg-destructive/5 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-destructive/10 text-destructive rounded-lg shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-destructive">
                    {t("Profile.deleteOrg")}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                    {t("Profile.deleteOrgDesc")}
                  </p>
                </div>
                <button
                  onClick={onDeleteOrg}
                  disabled={isPendingDelete}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-destructive/50 bg-background hover:bg-destructive/10 text-destructive h-10 px-4 py-2"
                >
                  {isPendingDelete && (
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  )}
                  {t("Profile.deleteOrgButton")}
                </button>
              </div>
            </div>
          )}{" "}
        </div>
      </div>
    </div>
  );
}