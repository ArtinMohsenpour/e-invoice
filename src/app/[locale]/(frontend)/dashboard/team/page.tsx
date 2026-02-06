import { redirect } from "next/navigation";
import TeamClient from "@/components/team/TeamClient";
import { getTeamData } from "@/data/team";

export default async function TeamPage() {
  const { user, members, invitations } = await getTeamData();

  if (!user) {
    redirect("/login");
  }

  return <TeamClient currentUser={user} members={members} invitations={invitations} />;
}