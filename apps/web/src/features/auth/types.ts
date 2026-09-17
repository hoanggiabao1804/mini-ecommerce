export type Gender = "male" | "female" | "other";
export type PersonalInfo = {
  username: string;
  fullName: string;
  birthDate: string;
  gender: Gender;
  address: string;
  phone: string;
  email: string;
};
export type ShippingAddress = {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  street: string;
  city: string;
  isDefault: boolean;
};
export type Account = PersonalInfo & {
  id: string;
  addresses: ShippingAddress[];
};
export type Registration = PersonalInfo & { password: string };
export type AddressInput = Omit<ShippingAddress, "id">;
