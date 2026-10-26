import { startTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, UserRound, MapPin, LogOut } from "lucide-react";
import { useAuth } from "../../features/auth/useAuth";
import PersonalDetails from "./components/PersonalDetails/PersonalDetails";
import AddressBook from "./components/AddressBook/AddressBook";
import styles from "./Profile.module.css";
export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <main id="main-content" className={styles.page}>
      <Link to="/" className={styles.back}>
        <ArrowLeft size={16} />
        Về trang chủ
      </Link>
      <div className={styles.heading}>
        <span>KHÔNG GIAN CỦA BẠN</span>
        <h1>Tài khoản của tôi</h1>
        <p>Quản lý thông tin cá nhân và những nơi bạn muốn nhận hàng.</p>
      </div>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.identity}>
            <span className={styles.avatar}>
              {user.fullName.charAt(0).toUpperCase()}
            </span>
            <strong>{user.fullName}</strong>
            <span>@{user.username}</span>
          </div>
          <nav aria-label="Điều hướng tài khoản">
            <a href="#personal">
              <UserRound size={18} />
              Thông tin cá nhân
            </a>
            <a href="#addresses">
              <MapPin size={18} />
              Địa chỉ nhận hàng <span>{user.addresses.length}</span>
            </a>
            <button
              type="button"
              onClick={() => {
                startTransition(() => {
                  logout();
                  navigate("/", { replace: true });
                });
              }}
            >
              <LogOut size={18} />
              Đăng xuất
            </button>
          </nav>
          <p>
            Phiên dùng thử
            <br />
            <span>Dữ liệu sẽ mất khi tải lại trang.</span>
          </p>
        </aside>
        <div className={styles.content}>
          <PersonalDetails key={user.id} />
          <AddressBook />
        </div>
      </div>
    </main>
  );
}
