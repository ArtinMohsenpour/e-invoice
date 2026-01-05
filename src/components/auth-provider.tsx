"use client";

import { useEffect, useRef } from "react";
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
  const isHydrated = useRef(false);

  if (!isHydrated.current) {
    useAuthStore.setState({ profile: initialProfile });
    isHydrated.current = true;
  }

  // Sync store with server-provided profile on prop change (e.g. after server action redirect)
  useEffect(() => {
      if (initialProfile && initialProfile.id !== useAuthStore.getState().profile?.id) {
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
        
        // Optimize: If initial load and IDs match, maybe skip? 
        // But for simplicity and correctness (e.g. profile updates elsewhere), fetching is safer.
        // However, to prevent double fetching on mount (since we passed initialProfile),
        // we could check event type.
        
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