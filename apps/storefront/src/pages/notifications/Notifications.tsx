import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, ArrowLeft } from "lucide-react";
import { useNotifications } from "../../features/notifications/useNotifications";
import NotificationList from "../../components/share/NotificationList/NotificationList";
import styles from "./Notifications.module.css";
export default function Notifications() {
  const { items, unreadCount, markAllRead } = useNotifications();
  const [unreadOnly, setUnreadOnly] = useState(false);
  const visible = unreadOnly ? items.filter((item) => !item.read) : items;
  return (
    <main id="main-content" className={styles.page}>
      <Link className={styles.back} to="/">
        <ArrowLeft size={16} />
        Trang chủ
      </Link>
      <div className={styles.heading}>
        <span className={styles.icon}>
          <Bell size={28} />
        </span>
        <div>
          <h1>Thông báo của bạn</h1>
          <p>Theo dõi kết quả thanh toán trong lần trải nghiệm này.</p>
        </div>
      </div>
      <section className={styles.card} aria-label="Danh sách thông báo">
        <div className={styles.toolbar}>
          <div
            className={styles.filters}
            role="group"
            aria-label="Lọc thông báo"
          >
            <button
              type="button"
              aria-pressed={!unreadOnly}
              onClick={() => setUnreadOnly(false)}
            >
              Tất cả ({items.length})
            </button>
            <button
              type="button"
              aria-pressed={unreadOnly}
              onClick={() => setUnreadOnly(true)}
            >
              Chưa đọc ({unreadCount})
            </button>
          </div>
          <button
            className={styles.mark}
            type="button"
            disabled={!unreadCount}
            onClick={markAllRead}
          >
            Đánh dấu tất cả đã đọc
          </button>
        </div>
        {unreadOnly && !visible.length ? (
          <p className={styles.empty}>Bạn đã đọc hết thông báo.</p>
        ) : (
          <NotificationList items={visible} />
        )}
      </section>
      <p className={styles.demo}>
        Thông báo demo được lưu tạm trong phiên hiện tại, chưa kết nối
        Notification Service.
      </p>
      <Link className={styles.back} to="/cart">
        Đi đến giỏ hàng →
      </Link>
    </main>
  );
}
