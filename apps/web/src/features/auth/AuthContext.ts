import { createContext } from "react";
import type {
  Account,
  Registration,
  PersonalInfo,
  AddressInput,
} from "./types";
export type AuthState = {
  user: Account | null;
  login: (identifier: string, password: string) => Promise<void>;
  register: (values: Registration) => Promise<void>;
  logout: () => void;
  updateProfile: (values: PersonalInfo) => Promise<void>;
  saveAddress: (values: AddressInput, id?: string) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
};
export const AuthContext = createContext<AuthState | null>(null);
