"use client";

import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { User } from "@/payload-types";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: User | null | undefined; // undefined means loading
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  setUser: () => null,
  logout: async () => {},
});

/**
 * Prop types for the AuthProvider
 * initialUser allows us to pass the user from a Server Component (Layout)
 * to the client state immediately on load.
 */
type AuthProviderProps = {
  children: React.ReactNode;
  initialUser?: User | null;
};

export const AuthProvider = ({ children, initialUser }: AuthProviderProps) => {
  // Initialize state with the user found on the server
  const [user, setUser] = useState<User | null | undefined>(initialUser);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/users/me", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      setUser(null);
      if (router) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, [router]);

  useEffect(() => {
    // If the server didn't find a user, try one last check on the client
    // just in case (optional, but helps with debugging).
    if (initialUser === null || initialUser === undefined) {
      fetchUser();
    }
  }, [fetchUser, initialUser]);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
