import { useState, type ReactNode } from "react";
import { AuthContext, type AuthState } from "./AuthContext";
import { demoAuth } from "./demoAuth";
import type { Account } from "./types";
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Account | null>(null);
  const value: AuthState = {
    user,
    login: async (identifier, password) => {
      setUser(await demoAuth.login(identifier, password));
    },
    register: async (values) => {
      setUser(await demoAuth.register(values));
    },
    logout: () => {
      demoAuth.logout();
      setUser(null);
    },
    updateProfile: async (values) => {
      setUser(await demoAuth.updateProfile(values));
    },
    saveAddress: async (values, id) => {
      setUser(await demoAuth.saveAddress(values, id));
    },
    deleteAddress: async (id) => {
      setUser(await demoAuth.deleteAddress(id));
    },
    setDefaultAddress: async (id) => {
      setUser(await demoAuth.setDefaultAddress(id));
    },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
