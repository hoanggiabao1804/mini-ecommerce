import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useAuth } from "../../../../features/auth/useAuth";
import type { DeliveryInfo } from "../../../../features/checkout/types";
import type { FormErrors } from "../../../../features/auth/validation";
import FormField from "../../../../components/share/FormField/FormField";
import styles from "./DeliveryForm.module.css";
export default function DeliveryForm({
  values,
  onChange,
  errors,
  selectedAddress,
  onSelect,
}: {
  values: DeliveryInfo;
  onChange: (values: DeliveryInfo) => void;
  errors: FormErrors;
  selectedAddress: string;
  onSelect: (id: string) => void;
}) {
  const { user } = useAuth();
  const set = (name: keyof DeliveryInfo, value: string) =>
    onChange({ ...values, [name]: value });
  const a11y = (id: string) => ({
    "aria-invalid": Boolean(errors[id]),
    "aria-describedby": errors[id] ? `${id}-error` : undefined,
  });
  return (
    <section className={styles.section} aria-labelledby="delivery-title">
      <div className={styles.heading}>
        <span>
          <MapPin size={21} />
        </span>
        <div>
          <h2 id="delivery-title">Thông tin nhận hàng</h2>
          <p>Thiết bị yêu thích sẽ đến địa chỉ nào?</p>
        </div>
      </div>
      {!!user?.addresses.length && (
        <fieldset className={styles.saved}>
          <legend>Chọn địa chỉ đã lưu</legend>
          {user.addresses.map((address) => (
            <label
              key={address.id}
              className={
                selectedAddress === address.id ? styles.selected : undefined
              }
            >
              <input
                type="radio"
                name="saved-address"
                value={address.id}
                checked={selectedAddress === address.id}
                onChange={() => onSelect(address.id)}
              />
              <span>
                <strong>
                  {address.label}
                  {address.isDefault && <small>Mặc định</small>}
                </strong>
                <span>
                  {address.recipient} · {address.phone}
                </span>
                <span>
                  {address.street}, {address.city}
                </span>
              </span>
            </label>
          ))}
          <label
            className={selectedAddress === "new" ? styles.selected : undefined}
          >
            <input
              type="radio"
              name="saved-address"
              checked={selectedAddress === "new"}
              onChange={() => onSelect("new")}
            />
            <strong>Dùng địa chỉ khác</strong>
          </label>
        </fieldset>
      )}
      <div className={styles.grid}>
        <FormField
          id="recipient"
          label="Họ tên người nhận"
          error={errors.recipient}
        >
          <input
            id="recipient"
            autoComplete="shipping name"
            maxLength={100}
            required
            placeholder="Nguyễn Minh Anh"
            value={values.recipient}
            onChange={(e) => set("recipient", e.target.value)}
            {...a11y("recipient")}
          />
        </FormField>
        <FormField id="phone" label="Số điện thoại" error={errors.phone}>
          <input
            id="phone"
            type="tel"
            autoComplete="shipping tel"
            maxLength={20}
            required
            placeholder="0901 234 567"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            {...a11y("phone")}
          />
        </FormField>
        <FormField id="email" label="Email" error={errors.email} wide>
          <input
            id="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
            placeholder="ban@example.com"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            {...a11y("email")}
          />
        </FormField>
        <FormField
          id="street"
          label="Địa chỉ chi tiết"
          error={errors.street}
          wide
        >
          <input
            id="street"
            autoComplete="shipping street-address"
            maxLength={300}
            required
            placeholder="Số nhà, đường, phường/xã"
            value={values.street}
            onChange={(e) => set("street", e.target.value)}
            {...a11y("street")}
          />
        </FormField>
        <FormField id="city" label="Tỉnh / Thành phố" error={errors.city} wide>
          <input
            id="city"
            autoComplete="shipping address-level1"
            maxLength={100}
            required
            placeholder="Ví dụ: Thành phố Hồ Chí Minh"
            value={values.city}
            onChange={(e) => set("city", e.target.value)}
            {...a11y("city")}
          />
        </FormField>
      </div>
      <label className={styles.note} htmlFor="note">
        Ghi chú giao hàng <span>(không bắt buộc)</span>
      </label>
      <textarea
        id="note"
        rows={3}
        maxLength={500}
        placeholder="Ví dụ: Gọi cho tôi trước khi giao hàng."
        value={values.note}
        onChange={(e) => set("note", e.target.value)}
      />
      {user && (
        <p className={styles.help}>
          Thông tin thay đổi ở đây chỉ áp dụng cho lần thanh toán này.{" "}
          <Link to="/profile#addresses">Quản lý địa chỉ đã lưu</Link>
        </p>
      )}
    </section>
  );
}
