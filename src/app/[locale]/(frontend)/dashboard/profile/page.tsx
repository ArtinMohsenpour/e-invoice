import { Metadata } from "next";
import { redirect } from "next/navigation";
import ProfileClient from "@/components/profile/ProfileClient";
import { getProfileData } from "@/data/profile";

export const metadata: Metadata = {
  title: "Profile Settings",
  description: "Manage your personal information and organization details",
};

export default async function ProfilePage() {
  const { user, organization } = await getProfileData();

  if (!user) {
    redirect("/login");
  }

  return <ProfileClient user={user} organization={organization} />;
}
