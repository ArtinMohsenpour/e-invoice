import { getMeUser } from "@/app/[locale]/(frontend)/actions/auth";
import { SettingsForm } from "@/components/dashboard/SettingsForm";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const user = await getMeUser();
  const t = await getTranslations("Settings");

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6 bg-background">
      <div>
        <h3 className="text-lg font-medium">{t("title")}</h3>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>
      <div className="border-t border-border pt-6">
        <SettingsForm user={user} />
      </div>
    </div>
  );
}
