import { startTransition, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserRound, ChevronDown, LogOut, MapPin } from "lucide-react";
import { useAuth } from "../../../features/auth/useAuth";
import styles from "./AccountMenu.module.css";
function Menu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", keyboard);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", keyboard);
    };
  }, [open]);
  if (!user)
    return (
      <Link
        className={styles.guest}
        to="/login"
        aria-label="Đăng nhập tài khoản"
      >
        <UserRound size={22} />
        <span>Tài khoản</span>
      </Link>
    );
  return (
    <div
      ref={ref}
      className={styles.root}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node))
          setOpen(false);
      }}
    >
      <button
        ref={trigger}
        className={styles.trigger}
        type="button"
        aria-expanded={open}
        aria-controls="account-dropdown"
        aria-label={`Tài khoản của ${user.fullName}`}
        onClick={() => setOpen(!open)}
      >
        <span className={styles.avatar}>
          {user.fullName.charAt(0).toUpperCase()}
        </span>
        <span className={styles.name}>{user.fullName.split(" ").at(-1)}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div id="account-dropdown" className={styles.dropdown}>
          <div className={styles.summary}>
            <strong>{user.fullName}</strong>
            <span>{user.email}</span>
          </div>
          <Link to="/profile">
            <UserRound size={17} />
            Tài khoản của tôi
          </Link>
          <Link to="/profile#addresses">
            <MapPin size={17} />
            Địa chỉ nhận hàng
          </Link>
          <button
            type="button"
            className={styles.logout}
            onClick={() => {
              startTransition(() => {
                logout();
                navigate("/", { replace: true });
              });
            }}
          >
            <LogOut size={17} />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
export default function AccountMenu() {
  const location = useLocation();
  return <Menu key={location.key} />;
}
