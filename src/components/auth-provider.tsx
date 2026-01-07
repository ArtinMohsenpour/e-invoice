"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/store/auth-store";
import { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function AuthProvider({
  children,
  initialProfile,
}: {
  children: React.ReactNode;
  initialProfile: Profile | null;
}) {
  const supabase = createClient();
  const setProfile = useAuthStore((state) => state.setProfile);

  // Sync store with server-provided profile
  useEffect(() => {
    const currentProfile = useAuthStore.getState().profile;
    const isDifferent =
      initialProfile?.id !== currentProfile?.id;

    if (isDifferent) {
      setProfile(initialProfile);
    }
  }, [initialProfile, setProfile]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // We might already have the profile from server, but refreshing on auth change is good practice
        // specifically for sign-in/sign-out events.
        
        if (event === 'INITIAL_SESSION' && initialProfile) {
            return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setProfile(profile);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, setProfile, initialProfile]);

  return <>{children}</>;
}