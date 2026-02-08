"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo } from "react";
import {
  updateOrganization,
  deleteOrganization,
} from "@/app/[locale]/(frontend)/actions/profile";
import { Loader2, Building, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { SaveSuccessIndicator } from "@/components/ui/SaveSuccessIndicator";
import { CountrySelector } from "@/components/ui/CountrySelector";
import { useFormState } from "@/lib/hooks/useFormState";
import { cn } from "@/lib/utils";
import { OrganizationSchema, type OrganizationInput } from "@/lib/validators";
import type { OrganizationFormProps } from "@/lib/types";

const OrganizationForm = memo(function OrganizationForm({
  user,
  organization,
}: OrganizationFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const { isPending, success, showToast, setSuccess, startTransition } =
    useFormState();
  const { isPending: isPendingDelete, startTransition: startTransitionDelete } =
    useFormState();

  const canEditOrg = !organization || user.orgRole === "owner";
  const isOwner = user.orgRole === "owner";

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

  const onSubmit = (data: OrganizationInput) => {
    setSuccess(false);
    startTransition(async () => {
      const result = await updateOrganization(organization?.id || null, data);
      if (!result.success) {
        showToast(result.error as string, "error");
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
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

  return (
    <div className="h-fit">
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
        <form onSubmit={orgForm.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t("fields.orgName")}
              </label>
              <input
                {...orgForm.register("name")}
                disabled={!canEditOrg || isPending}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
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
                disabled={!canEditOrg || isPending}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
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
              disabled={!canEditOrg || isPending}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
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
              disabled={!canEditOrg || isPending}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
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
                disabled={!canEditOrg || isPending}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
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
                disabled={!canEditOrg || isPending}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
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
              <CountrySelector
                value={orgForm.watch("address.country")}
                onChange={(val) =>
                  orgForm.setValue("address.country", val, {
                    shouldValidate: true,
                  })
                }
                disabled={!canEditOrg || isPending}
                error={orgForm.formState.errors.address?.country?.message}
              />
              {orgForm.formState.errors.address?.country && (
                <p className="text-xs text-destructive mt-1">
                  {orgForm.formState.errors.address.country.message}
                </p>
              )}
            </div>
          </div>

          {canEditOrg && (
            <div className="flex justify-end pt-4">
              <div className="relative flex items-center">
                <SaveSuccessIndicator
                  isVisible={success}
                  message={t("Settings.savedSuccessfully")}
                />
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  {isPending && (
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
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-destructive/50 bg-background hover:bg-destructive/10 text-destructive h-10 px-4 py-2"
            >
              {isPendingDelete && (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              )}
              {t("Profile.deleteOrgButton")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default OrganizationForm;
