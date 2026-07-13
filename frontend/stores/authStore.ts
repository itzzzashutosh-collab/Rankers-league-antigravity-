"use client";

import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";
import { UserProfile, AuthState } from "@/types/auth";

interface AuthActions {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  isProfileComplete: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setSession: (session) =>
    set({
      session,
    }),

  setProfile: (profile) =>
    set({
      profile,
      isProfileComplete: profile?.profile_status === "complete",
    }),

  setLoading: (isLoading) => set({ isLoading }),

  signOut: () =>
    set({
      user: null,
      session: null,
      profile: null,
      isAuthenticated: false,
      isProfileComplete: false,
    }),
}));
