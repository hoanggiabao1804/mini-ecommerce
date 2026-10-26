import { useEffect, useRef, useState, type FormEvent } from "react";
import { X, MapPin } from "lucide-react";
import FormField from "../../../../components/share/FormField/FormField";
import { useAuth } from "../../../../features/auth/useAuth";
import {
  validateAddress,
  focusFirstError,
  type FormErrors,
} from "../../../../features/auth/validation";
import type {
  ShippingAddress,
  AddressInput,
} from "../../../../features/auth/types";
import styles from "./AddressForm.module.css";
export default function AddressForm({
  address,
  onClose,
  onSaved,
}: {
  address?: ShippingAddress;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { user, saveAddress } = useAuth();
  const [values, setValues] = useState<AddressInput>(
    () =>
      address ?? {
        label: "Nhà riêng",
        recipient: user?.fullName ?? "",
        phone: user?.phone ?? "",
        street: "",
        city: "",
        isDefault: !user?.addresses.length,
      },
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    dialog?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previous;
      if (previousFocus?.isConnected)
        previousFocus.focus({ preventScroll: true });
    };
  }, []);
  const set = (name: keyof AddressInput, value: string | boolean) =>
    setValues({ ...values, [name]: value });
  const a11y = (name: string) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const next = validateAddress(values);
    setErrors(next);
    if (Object.keys(next).length) {
      focusFirstError(
        Object.fromEntries(
          Object.entries(next).map(([key, value]) => [
            key === "phone" ? "shippingPhone" : key,
            value,
          ]),
        ),
      );
      return;
    }
    setBusy(true);
    try {
      await saveAddress(values, address?.id);
      onSaved();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Chưa thể lưu địa chỉ.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="address-form-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.content}>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Đóng biểu mẫu địa chỉ"
        >
          <X size={20} />
        </button>
        <span className={styles.icon}>
          <MapPin size={23} />
        </span>
        <h2 id="address-form-title">
          {address ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ nhận hàng"}
        </h2>
        <p className={styles.subtitle}>
          Để thiết bị yêu thích đến đúng nơi bạn muốn.
        </p>
        <form onSubmit={submit} noValidate className={styles.form}>
          <FormField id="label" label="Tên gợi nhớ" error={errors.label} wide>
            <input
              id="label"
              autoFocus
              placeholder="Nhà riêng, văn phòng…"
              maxLength={40}
              required
              value={values.label}
              onChange={(e) => set("label", e.target.value)}
              {...a11y("label")}
            />
          </FormField>
          <FormField
            id="recipient"
            label="Tên người nhận"
            error={errors.recipient}
          >
            <input
              id="recipient"
              autoComplete="shipping name"
              maxLength={100}
              required
              value={values.recipient}
              onChange={(e) => set("recipient", e.target.value)}
              {...a11y("recipient")}
            />
          </FormField>
          <FormField
            id="shippingPhone"
            label="Số điện thoại nhận hàng"
            error={errors.phone}
          >
            <input
              id="shippingPhone"
              type="tel"
              autoComplete="shipping tel"
              maxLength={20}
              required
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={
                errors.phone ? "shippingPhone-error" : undefined
              }
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
              placeholder="Số nhà, đường, phường/xã"
              maxLength={300}
              required
              value={values.street}
              onChange={(e) => set("street", e.target.value)}
              {...a11y("street")}
            />
          </FormField>
          <FormField
            id="city"
            label="Tỉnh / Thành phố"
            error={errors.city}
            wide
          >
            <input
              id="city"
              autoComplete="shipping address-level1"
              placeholder="Ví dụ: Thành phố Hồ Chí Minh"
              maxLength={100}
              required
              value={values.city}
              onChange={(e) => set("city", e.target.value)}
              {...a11y("city")}
            />
          </FormField>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={values.isDefault}
              disabled={!user?.addresses.length || Boolean(address?.isDefault)}
              onChange={(e) => set("isDefault", e.target.checked)}
            />
            Đặt làm địa chỉ mặc định
          </label>
          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}
          <div className={styles.buttons}>
            <button type="button" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" disabled={busy}>
              {busy ? "Đang lưu…" : "Lưu địa chỉ"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
