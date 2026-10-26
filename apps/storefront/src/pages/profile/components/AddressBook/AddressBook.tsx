import { useState } from "react";
import { MapPin, Plus, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../../../features/auth/useAuth";
import type { ShippingAddress } from "../../../../features/auth/types";
import AddressForm from "../AddressForm/AddressForm";
import styles from "./AddressBook.module.css";
export default function AddressBook() {
  const { user, deleteAddress, setDefaultAddress } = useAuth();
  const [editing, setEditing] = useState<ShippingAddress | "new" | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function remove(id: string) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await deleteAddress(id);
      setDeleting(null);
      setMessage("Đã xóa địa chỉ nhận hàng.");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Chưa thể xóa địa chỉ.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function makeDefault(id: string) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await setDefaultAddress(id);
      setMessage("Đã cập nhật địa chỉ mặc định.");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Chưa thể cập nhật địa chỉ.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section
      id="addresses"
      className={styles.section}
      aria-labelledby="addresses-title"
    >
      <div className={styles.heading}>
        <div>
          <span className={styles.icon}>
            <MapPin size={20} />
          </span>
          <div>
            <h2 id="addresses-title">Địa chỉ nhận hàng</h2>
            <p>Lưu nhiều địa chỉ, thuận tiện mỗi lần mua sắm.</p>
          </div>
        </div>
        <button
          type="button"
          className={styles.add}
          onClick={() => {
            setMessage("");
            setEditing("new");
          }}
        >
          <Plus size={16} />
          Thêm địa chỉ
        </button>
      </div>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      <p role="status" className={styles.status}>
        {message && (
          <>
            <CheckCircle2 size={16} />
            {message}
          </>
        )}
      </p>
      {!user?.addresses.length ? (
        <div className={styles.empty}>
          <MapPin size={34} strokeWidth={1.3} />
          <h3>Nhận hàng ở đâu, bạn nhỉ?</h3>
          <p>
            Thêm địa chỉ nhà riêng hoặc văn phòng để sẵn sàng cho lần mua sắm
            tiếp theo.
          </p>
          <button type="button" onClick={() => setEditing("new")}>
            Thêm địa chỉ đầu tiên <Plus size={15} />
          </button>
        </div>
      ) : (
        <div className={styles.list}>
          {user.addresses.map((address) => (
            <article
              key={address.id}
              className={`${styles.card} ${address.isDefault ? styles.defaultCard : ""}`}
              aria-label={`Địa chỉ ${address.label}`}
            >
              <div className={styles.cardHeading}>
                <h3>{address.label}</h3>
                {address.isDefault && (
                  <span className={styles.badge}>Mặc định</span>
                )}
              </div>
              <div className={styles.recipient}>
                <strong>{address.recipient}</strong>
                <span>{address.phone}</span>
              </div>
              <p>
                {address.street}
                <br />
                {address.city}
              </p>
              <div className={styles.actions}>
                {!address.isDefault && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => makeDefault(address.id)}
                  >
                    Đặt làm mặc định
                  </button>
                )}
                <button type="button" onClick={() => setEditing(address)}>
                  <Pencil size={14} />
                  Chỉnh sửa
                </button>
                <button
                  type="button"
                  className={styles.delete}
                  onClick={() => setDeleting(address.id)}
                >
                  <Trash2 size={14} />
                  Xóa
                </button>
              </div>
              {deleting === address.id && (
                <div
                  className={styles.confirm}
                  role="group"
                  aria-label={`Xác nhận xóa ${address.label}`}
                >
                  <p>Xóa địa chỉ “{address.label}”?</p>
                  <button
                    type="button"
                    onClick={() => setDeleting(null)}
                    disabled={busy}
                  >
                    Giữ lại
                  </button>
                  <button
                    type="button"
                    className={styles.delete}
                    disabled={busy}
                    onClick={() => remove(address.id)}
                  >
                    Xác nhận xóa
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
      {editing && (
        <AddressForm
          address={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            setMessage("Đã lưu địa chỉ nhận hàng.");
          }}
        />
      )}
    </section>
  );
}
