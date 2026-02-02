"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(userId: number, data: {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}) {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const headersList = await headers();

  try {
    const { user } = await payload.auth({ headers: headersList });
    
    if (!user || user.id !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    await payload.update({
      collection: "users",
      id: userId,
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
      },
    });

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function updateOrganization(orgId: number | null, data: {
  name: string;
  taxId?: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    zip?: string;
    country?: string;
  };
}) {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const headersList = await headers();

  try {
    const { user } = await payload.auth({ headers: headersList });
    
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const currentOrgId = typeof user.organization === 'object' && user.organization ? user.organization.id : user.organization;

    // Create new organization if none exists
    if (!currentOrgId) {
      const newOrg = await payload.create({
        collection: "organizations",
        data: {
          name: data.name,
          taxId: data.taxId,
          phoneNumber: data.phoneNumber,
          address: data.address,
        },
      });

      // Link user to new org as owner
      await payload.update({
        collection: "users",
        id: user.id,
        data: {
          organization: newOrg.id,
          orgRole: "owner",
        },
      });

      revalidatePath("/dashboard/profile");
      return { success: true };
    }

    // Update existing organization
    // Verify the user is trying to update their own organization
    if (orgId && currentOrgId !== orgId) {
       return { success: false, error: "Unauthorized" };
    }

    await payload.update({
      collection: "organizations",
      id: currentOrgId as number,
      data: {
        name: data.name,
        taxId: data.taxId,
        phoneNumber: data.phoneNumber,
        address: data.address,
      },
    });

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to update organization:", error);
    return { success: false, error: "Failed to update organization" };
  }
}

export async function deleteOrganization(orgId: number) {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const headersList = await headers();

  try {
    const { user } = await payload.auth({ headers: headersList });
    
    if (!user || !user.organization) {
      return { success: false, error: "Unauthorized" };
    }

    const userOrgId = typeof user.organization === 'object' ? user.organization.id : user.organization;

    if (userOrgId !== orgId) {
      return { success: false, error: "Unauthorized" };
    }

    if (user.orgRole !== 'owner') {
      return { success: false, error: "Forbidden: Only owners can delete the organization." };
    }

    await payload.delete({
      collection: "organizations",
      id: orgId,
    });
    
    // Also update the user to remove the org association? 
    // Or maybe the user should be deleted? 
    // Usually deleting the org might cascade or leave the user orphaned. 
    // For now, we just delete the org. 
    // We might want to set the user's organization field to null.
    
    await payload.update({
        collection: "users",
        id: user.id,
        data: {
            organization: null,
            orgRole: null
        }
    })

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete organization:", error);
    return { success: false, error: "Failed to delete organization" };
  }
}
