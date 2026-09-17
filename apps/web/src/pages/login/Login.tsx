import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, AlertCircle } from "lucide-react";
import AuthLayout from "../../components/share/AuthLayout/AuthLayout";
import FormField from "../../components/share/FormField/FormField";
import PasswordInput from "../../components/share/PasswordInput/PasswordInput";
import { useAuth } from "../../features/auth/useAuth";
import styles from "./Login.module.css";
export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const destination = location.state?.from === "/profile" ? "/profile" : "/";
  if (user) return <Navigate to={destination} replace />;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(identifier, password);
      navigate(destination, { replace: true });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Chưa thể đăng nhập. Vui lòng thử lại.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <AuthLayout>
      <div className={styles.heading}>
        <span>TÀI KHOẢN MINI</span>
        <h2>Đăng nhập</h2>
        <p>Rất vui được gặp lại bạn. Cùng khám phá tiếp nhé!</p>
      </div>
      <form onSubmit={submit} className={styles.form}>
        <FormField id="identifier" label="Tên đăng nhập hoặc email">
          <input
            id="identifier"
            name="username"
            autoComplete="username"
            placeholder="Tên đăng nhập hoặc email của bạn"
            required
            maxLength={254}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </FormField>
        <FormField id="password" label="Mật khẩu">
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="Nhập mật khẩu"
            required
            maxLength={128}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormField>
        {error && (
          <p role="alert" className={styles.error}>
            <AlertCircle size={17} />
            {error}
          </p>
        )}
        <button className={styles.submit} type="submit" disabled={busy}>
          {busy ? "Đang đăng nhập…" : "Đăng nhập"}
          <ArrowRight size={18} />
        </button>
      </form>
      <p className={styles.switch}>
        Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
      </p>
      <p className={styles.demo}>
        Bản dùng thử: tài khoản và hồ sơ chỉ được giữ trong bộ nhớ của tab. Tải
        lại trang sẽ xóa dữ liệu.
      </p>
    </AuthLayout>
  );
}
