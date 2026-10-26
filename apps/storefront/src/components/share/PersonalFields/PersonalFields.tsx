import FormField from "../FormField/FormField";
import type { PersonalInfo, Gender } from "../../../features/auth/types";
import { today, type FormErrors } from "../../../features/auth/validation";
import styles from "./PersonalFields.module.css";
export default function PersonalFields({
  values,
  onChange,
  errors,
}: {
  values: PersonalInfo;
  onChange: (values: PersonalInfo) => void;
  errors: FormErrors;
}) {
  const set = (key: keyof PersonalInfo, value: string) =>
    onChange({ ...values, [key]: value });
  const a11y = (id: string) => ({
    "aria-invalid": Boolean(errors[id]),
    "aria-describedby": errors[id] ? `${id}-error` : undefined,
  });
  return (
    <div className={styles.grid}>
      <FormField id="fullName" label="Họ và tên" error={errors.fullName}>
        <input
          id="fullName"
          autoComplete="name"
          placeholder="Nguyễn Minh Anh"
          required
          maxLength={100}
          value={values.fullName}
          onChange={(e) => set("fullName", e.target.value)}
          {...a11y("fullName")}
        />
      </FormField>
      <FormField id="username" label="Tên đăng nhập" error={errors.username}>
        <input
          id="username"
          autoComplete="username"
          placeholder="minhanh"
          required
          maxLength={30}
          value={values.username}
          onChange={(e) => set("username", e.target.value)}
          {...a11y("username")}
        />
      </FormField>
      <FormField id="birthDate" label="Ngày sinh" error={errors.birthDate}>
        <input
          id="birthDate"
          type="date"
          autoComplete="bday"
          required
          min="1900-01-01"
          max={today()}
          value={values.birthDate}
          onChange={(e) => set("birthDate", e.target.value)}
          {...a11y("birthDate")}
        />
      </FormField>
      <FormField id="gender" label="Giới tính" error={errors.gender}>
        <select
          id="gender"
          value={values.gender}
          onChange={(e) => set("gender", e.target.value as Gender)}
          {...a11y("gender")}
        >
          <option value="other">Khác / Không muốn chia sẻ</option>
          <option value="female">Nữ</option>
          <option value="male">Nam</option>
        </select>
      </FormField>
      <FormField id="phone" label="Số điện thoại" error={errors.phone}>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="0901 234 567"
          required
          maxLength={20}
          value={values.phone}
          onChange={(e) => set("phone", e.target.value)}
          {...a11y("phone")}
        />
      </FormField>
      <FormField id="email" label="Email" error={errors.email}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="ban@example.com"
          required
          maxLength={254}
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          {...a11y("email")}
        />
      </FormField>
      <FormField id="address" label="Địa chỉ" error={errors.address} wide>
        <input
          id="address"
          autoComplete="street-address"
          placeholder="Số nhà, đường, phường/xã, tỉnh/thành phố"
          required
          maxLength={300}
          value={values.address}
          onChange={(e) => set("address", e.target.value)}
          {...a11y("address")}
        />
      </FormField>
    </div>
  );
}
