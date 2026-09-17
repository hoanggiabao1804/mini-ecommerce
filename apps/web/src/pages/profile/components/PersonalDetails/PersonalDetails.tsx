import { useState, type FormEvent } from "react";
import { UserRound, CheckCircle2, Save } from "lucide-react";
import { useAuth } from "../../../../features/auth/useAuth";
import {
  validatePersonal,
  focusFirstError,
  type FormErrors,
} from "../../../../features/auth/validation";
import PersonalFields from "../../../../components/share/PersonalFields/PersonalFields";
import type { PersonalInfo } from "../../../../features/auth/types";
import styles from "./PersonalDetails.module.css";
export default function PersonalDetails() {
  const { user, updateProfile } = useAuth();
  const [values, setValues] = useState<PersonalInfo>(() => ({ ...user! }));
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    const next = validatePersonal(values);
    setErrors(next);
    if (Object.keys(next).length) {
      focusFirstError(next);
      return;
    }
    setBusy(true);
    try {
      await updateProfile(values);
      setMessage("Đã cập nhật thông tin cá nhân.");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Chưa thể lưu thông tin.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section
      id="personal"
      className={styles.section}
      aria-labelledby="personal-title"
    >
      <div className={styles.heading}>
        <span>
          <UserRound size={20} />
        </span>
        <div>
          <h2 id="personal-title">Thông tin cá nhân</h2>
          <p>Thông tin giúp chúng tôi hiểu bạn hơn.</p>
        </div>
      </div>
      <form noValidate onSubmit={submit}>
        <PersonalFields
          values={values}
          errors={errors}
          onChange={(next) => {
            setValues(next);
            setMessage("");
          }}
        />
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
        <div className={styles.bottom}>
          <p role="status">
            {message && (
              <>
                <CheckCircle2 size={16} />
                {message}
              </>
            )}
          </p>
          <button type="submit" disabled={busy}>
            <Save size={16} />
            {busy ? "Đang lưu…" : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </section>
  );
}
