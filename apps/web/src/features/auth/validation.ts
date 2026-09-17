import type { PersonalInfo, AddressInput } from "./types";
export type FormErrors = Record<string, string>;
export const today = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};
const phoneValid = (phone: string) =>
  /^(0[0-9]{9}|\+84[0-9]{9})$/.test(phone.replace(/[\s.-]/g, ""));
const emailValid = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
export function validatePersonal(values: PersonalInfo): FormErrors {
  const errors: FormErrors = {};
  if (!/^[a-zA-Z0-9_]{3,30}$/.test(values.username.trim()))
    errors.username = "Dùng 3–30 chữ cái không dấu, số hoặc dấu gạch dưới.";
  if (values.fullName.trim().length < 2)
    errors.fullName = "Vui lòng nhập họ và tên.";
  const date = new Date(`${values.birthDate}T00:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(values.birthDate) ||
    Number.isNaN(date.valueOf()) ||
    date.toISOString().slice(0, 10) !== values.birthDate ||
    values.birthDate < "1900-01-01" ||
    values.birthDate > today()
  )
    errors.birthDate = "Vui lòng chọn ngày sinh hợp lệ, không ở tương lai.";
  if (!["male", "female", "other"].includes(values.gender))
    errors.gender = "Vui lòng chọn giới tính.";
  if (values.address.trim().length < 5)
    errors.address = "Vui lòng nhập địa chỉ đầy đủ.";
  if (!phoneValid(values.phone))
    errors.phone = "Nhập số điện thoại Việt Nam hợp lệ (0 hoặc +84).";
  if (!emailValid(values.email)) errors.email = "Địa chỉ email chưa hợp lệ.";
  return errors;
}
export function validateAddress(values: AddressInput): FormErrors {
  const errors: FormErrors = {};
  if (!values.label.trim()) errors.label = "Đặt tên để dễ nhận biết địa chỉ.";
  if (values.recipient.trim().length < 2)
    errors.recipient = "Vui lòng nhập tên người nhận.";
  if (!phoneValid(values.phone))
    errors.phone = "Số điện thoại người nhận chưa hợp lệ.";
  if (values.street.trim().length < 5)
    errors.street = "Nhập số nhà, đường và phường/xã.";
  if (values.city.trim().length < 2)
    errors.city = "Vui lòng nhập tỉnh hoặc thành phố.";
  return errors;
}
export function focusFirstError(errors: FormErrors) {
  const name = Object.keys(errors)[0];
  if (name) requestAnimationFrame(() => document.getElementById(name)?.focus());
}
