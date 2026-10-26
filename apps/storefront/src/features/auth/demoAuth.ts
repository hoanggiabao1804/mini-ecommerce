import type {
  Account,
  PersonalInfo,
  Registration,
  AddressInput,
  ShippingAddress,
} from "./types";
import { validatePersonal, validateAddress } from "./validation";
// UI demo only: all data is ephemeral and stays in this tab's memory.
// This is not authentication or authorization for a backend API.
type StoredAccount = { user: Account; passwordHash: string };
const accounts = new Map<string, StoredAccount>();
let currentId: string | null = null;
const copy = (account: Account) => structuredClone(account);
const normalize = (value: string) => value.trim().toLowerCase();
const hash = async (password: string) =>
  Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password)),
    ),
  )
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
function cleanPersonal(values: PersonalInfo): PersonalInfo {
  return {
    username: values.username.trim(),
    fullName: values.fullName.trim(),
    birthDate: values.birthDate,
    gender: values.gender,
    address: values.address.trim(),
    phone: values.phone.trim(),
    email: normalize(values.email),
  };
}
function checkPersonal(values: PersonalInfo, exceptId?: string) {
  const errors = validatePersonal(values);
  if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]);
  for (const { user } of accounts.values()) {
    if (user.id === exceptId) continue;
    if (normalize(user.username) === normalize(values.username))
      throw new Error("Tên đăng nhập này đã được sử dụng. Hãy chọn tên khác.");
    if (normalize(user.email) === normalize(values.email))
      throw new Error(
        "Email này đã được đăng ký. Bạn có thể đăng nhập bằng email này.",
      );
  }
}
function current() {
  const account = currentId ? accounts.get(currentId) : undefined;
  if (!account) throw new Error("Vui lòng đăng nhập để tiếp tục.");
  return account;
}
function saveAddresses(addresses: ShippingAddress[]) {
  const account = current();
  if (addresses.length && !addresses.some((address) => address.isDefault))
    addresses[0] = { ...addresses[0], isDefault: true };
  account.user = { ...account.user, addresses };
  return copy(account.user);
}
export const demoAuth = {
  async register(values: Registration) {
    const personal = cleanPersonal(values);
    if (values.password.length < 8 || values.password.length > 128)
      throw new Error("Mật khẩu cần từ 8 đến 128 ký tự.");
    const passwordHash = await hash(values.password);
    checkPersonal(personal);
    const user: Account = {
      ...personal,
      id: crypto.randomUUID(),
      addresses: [],
    };
    accounts.set(user.id, { user, passwordHash });
    currentId = user.id;
    return copy(user);
  },
  async login(identifier: string, password: string) {
    const passwordHash = await hash(password);
    const account = [...accounts.values()].find(
      ({ user }) =>
        normalize(user.username) === normalize(identifier) ||
        normalize(user.email) === normalize(identifier),
    );
    if (!account || account.passwordHash !== passwordHash)
      throw new Error("Tên đăng nhập/email hoặc mật khẩu chưa đúng.");
    currentId = account.user.id;
    return copy(account.user);
  },
  logout() {
    currentId = null;
  },
  async updateProfile(values: PersonalInfo) {
    const account = current();
    const personal = cleanPersonal(values);
    checkPersonal(personal, account.user.id);
    account.user = { ...account.user, ...personal };
    return copy(account.user);
  },
  async saveAddress(values: AddressInput, id?: string) {
    const account = current();
    const errors = validateAddress(values);
    if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]);
    const existing = account.user.addresses.find(
      (address) => address.id === id,
    );
    if (id && !existing) throw new Error("Địa chỉ không còn tồn tại.");
    const isDefault =
      values.isDefault ||
      Boolean(existing?.isDefault) ||
      !account.user.addresses.length;
    const address: ShippingAddress = {
      id: id ?? crypto.randomUUID(),
      label: values.label.trim(),
      recipient: values.recipient.trim(),
      phone: values.phone.trim(),
      street: values.street.trim(),
      city: values.city.trim(),
      isDefault,
    };
    const rest = account.user.addresses.map((item) =>
      isDefault ? { ...item, isDefault: false } : item,
    );
    return saveAddresses(
      id
        ? rest.map((item) => (item.id === id ? address : item))
        : [...rest, address],
    );
  },
  async deleteAddress(id: string) {
    return saveAddresses(
      current().user.addresses.filter((address) => address.id !== id),
    );
  },
  async setDefaultAddress(id: string) {
    const addresses = current().user.addresses;
    if (!addresses.some((address) => address.id === id))
      throw new Error("Địa chỉ không còn tồn tại.");
    return saveAddresses(
      addresses.map((address) => ({
        ...address,
        isDefault: address.id === id,
      })),
    );
  },
};
