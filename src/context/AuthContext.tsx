import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useAuth } from "@/auth/AuthProvider";
import type { Department } from "@/types";
import { getDepartments, updateProfile } from "@/services/api";

type AuthCtx = {
  user: any;
  profile: any;
  loading: boolean;
  role: "student" | "admin";
  departments: Department[];
  activeDepartment: Department | null;
  setActiveDepartment: (d: Department) => void;
  signIn: (...args: any[]) => Promise<any>;
  signUp: (...args: any[]) => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (...args: any[]) => Promise<any>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  isAdmin: boolean;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AppAuthProvider({ children }: { children: ReactNode }) {
  const { user, profile, loading, signIn, signUp, signOut, resetPassword, updatePassword } =
    useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [activeDepartment, setActiveDepartment] = useState<Department | null>(null);

  useEffect(() => {
    getDepartments().then((deps) => {
      setDepartments(deps);
      if (deps.length > 0) {
        const preferred = profile?.preferred_department_id;
        const match = preferred ? deps.find((d) => d.id === preferred) : null;
        setActiveDepartment(match ?? deps.find((d) => d.status === "active") ?? deps[0]);
      }
    }).catch(() => {});
  }, [profile?.preferred_department_id]);

  const handleSetActiveDepartment = useCallback((d: Department) => {
    setActiveDepartment(d);
    if (user?.id) {
      updateProfile(user.id, { preferred_department_id: d.id }).catch(() => {});
    }
  }, [user?.id]);

  const role = profile?.role === "admin" ? "admin" : "student";

  return (
    <Ctx.Provider value={{
      user, profile, loading, role,
      departments, activeDepartment, setActiveDepartment: handleSetActiveDepartment,
      signIn, signUp, signOut, resetPassword, updatePassword,
      isAdmin: role === "admin",
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAppAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppAuth must be inside AppAuthProvider");
  return ctx;
}