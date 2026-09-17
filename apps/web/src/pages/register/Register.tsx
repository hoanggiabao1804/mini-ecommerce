import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, AlertCircle } from "lucide-react";
import AuthLayout from "../../components/share/AuthLayout/AuthLayout";
import FormField from "../../components/share/FormField/FormField";
import PasswordInput from "../../components/share/PasswordInput/PasswordInput";
import PersonalFields from "../../components/share/PersonalFields/PersonalFields";
import { useAuth } from "../../features/auth/useAuth";
import {
  validatePersonal,
  focusFirstError,
  type FormErrors,
} from "../../features/auth/validation";
import type { PersonalInfo } from "../../features/auth/types";
import styles from "./Register.module.css";
const initial: PersonalInfo = {
  username: "",
  fullName: "",
  birthDate: "",
  gender: "other",
  address: "",
  phone: "",
  email: "",
};
export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState(initial);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" replace />;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const next = validatePersonal(values);
    if (password.length < 8) next.password = "Mật khẩu cần ít nhất 8 ký tự.";
    if (password !== confirmPassword)
      next.confirmPassword = "Mật khẩu xác nhận chưa khớp.";
    setErrors(next);
    if (Object.keys(next).length) {
      focusFirstError(next);
      return;
    }
    setBusy(true);
    try {
      await register({ ...values, password });
      navigate("/", { replace: true });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Chưa thể đăng ký. Vui lòng thử lại.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <AuthLayout register>
      <div className={styles.heading}>
        <span>CHÀO MỪNG BẠN ĐẾN VỚI MINI</span>
        <h2>Tạo tài khoản</h2>
        <p>Điền thông tin bên dưới để bắt đầu trải nghiệm.</p>
      </div>
      <form onSubmit={submit} noValidate className={styles.form}>
        <PersonalFields values={values} onChange={setValues} errors={errors} />
        <div className={styles.passwords}>
          <FormField
            id="password"
            label="Mật khẩu"
            error={errors.password}
            hint="Tối thiểu 8 ký tự."
          >
            <PasswordInput
              id="password"
              autoComplete="new-password"
              required
              maxLength={128}
              placeholder="Tạo mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "password-error" : "password-hint"
              }
            />
          </FormField>
          <FormField
            id="confirmPassword"
            label="Xác nhận mật khẩu"
            error={errors.confirmPassword}
          >
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              required
              maxLength={128}
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword ? "confirmPassword-error" : undefined
              }
            />
          </FormField>
        </div>
        {error && (
          <p role="alert" className={styles.error}>
            <AlertCircle size={16} />
            {error}
          </p>
        )}
        <button className={styles.submit} type="submit" disabled={busy}>
          {busy ? "Đang tạo tài khoản…" : "Tạo tài khoản"}
          <ArrowRight size={18} />
        </button>
      </form>
      <p className={styles.switch}>
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
      <p className={styles.demo}>
        Bản dùng thử: dữ liệu chỉ giữ trong bộ nhớ của tab. Đăng ký thành công
        sẽ đưa bạn về Home với tài khoản vừa tạo.
      </p>
    </AuthLayout>
  );
}
