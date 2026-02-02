import { getPayload } from "payload";
import configPromise from "@payload-config";
import { User, Organization } from "@/payload-types";
import { headers } from "next/headers";

export async function getProfileData(): Promise<{ user: User | null; organization: Organization | null }> {
  const payload = await getPayload({ config: configPromise });
  const headersList = await headers();

  const { user } = await payload.auth({ headers: headersList });

  if (!user) {
    return { user: null, organization: null };
  }

  // Fetch full user details with depth to ensure organization is populated
  const fullUser = await payload.findByID({
    collection: "users",
    id: user.id,
    depth: 1,
  }) as User;

  const organization = (typeof fullUser.organization === 'object' ? fullUser.organization : null) as Organization | null;

  return { user: fullUser, organization };
}
