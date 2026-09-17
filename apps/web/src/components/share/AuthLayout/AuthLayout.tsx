import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, UserRound, MapPin } from "lucide-react";
import styles from "./AuthLayout.module.css";
export default function AuthLayout({
  children,
  register = false,
}: {
  children: ReactNode;
  register?: boolean;
}) {
  return (
    <main id="main-content" className={styles.page}>
      <Link to="/" className={styles.back}>
        <ArrowLeft size={16} />
        Về trang chủ
      </Link>
      <div className={`${styles.panel} ${register ? styles.register : ""}`}>
        <aside className={styles.intro}>
          <div className={styles.brand}>
            <img src="/logo.png" alt="" />
            <span>mini ecommerce</span>
          </div>
          <div className={styles.story}>
            <span className={styles.eyebrow}>KHÔNG GIAN CÔNG NGHỆ CỦA BẠN</span>
            <h1>
              {register ? (
                <>
                  Bắt đầu kết nối.
                  <br />
                  Khám phá chất riêng.
                </>
              ) : (
                <>
                  Chào bạn trở lại.
                  <br />
                  Tiếp nối cảm hứng.
                </>
              )}
            </h1>
            <p>
              Một tài khoản cho những thiết bị yêu thích
              <br />
              và trải nghiệm mua sắm của riêng bạn.
            </p>
            <div className={styles.art}>
              <div className={styles.orbit} />
              <img
                src="/images/products/iphone.png"
                alt="iPhone với sắc tím và xanh"
              />
              <span className={styles.sparkle}>
                <Sparkles size={23} />
              </span>
            </div>
            <div className={styles.features}>
              <span>
                <UserRound size={16} />
                Hồ sơ của riêng bạn
              </span>
              <span>
                <MapPin size={16} />
                Lưu nhiều địa chỉ nhận hàng
              </span>
            </div>
          </div>
          <span className={styles.caption}>
            CÔNG NGHỆ BẠN YÊU. LỰA CHỌN BẠN MUỐN.
          </span>
        </aside>
        <section className={styles.form}>{children}</section>
      </div>
    </main>
  );
}
