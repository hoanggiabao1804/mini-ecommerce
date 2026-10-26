import { Bell, CircleCheck, CircleAlert, Check } from "lucide-react";
import { useNotifications } from "../../../features/notifications/useNotifications";
import type { Notification } from "../../../features/notifications/NotificationContext";
import styles from "./NotificationList.module.css";
export default function NotificationList({ items }: { items: Notification[] }) {
  const { markRead } = useNotifications();
  if (!items.length)
    return (
      <div className={styles.empty}>
        <Bell size={32} />
        <h3>Chưa có thông báo</h3>
        <p>Kết quả thanh toán demo sẽ xuất hiện tại đây.</p>
      </div>
    );
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li
          key={item.id}
          className={`${styles.item} ${!item.read ? styles.unread : ""}`}
        >
          <span
            className={
              item.kind === "success" ? styles.success : styles.failure
            }
          >
            {item.kind === "success" ? (
              <CircleCheck size={21} />
            ) : (
              <CircleAlert size={21} />
            )}
          </span>
          <div className={styles.content}>
            <h3>
              {item.title}
              {!item.read && (
                <span className={styles.dot} aria-label="Chưa đọc" />
              )}
            </h3>
            <p>{item.message}</p>
            <time dateTime={item.createdAt}>
              {new Date(item.createdAt).toLocaleString("vi-VN")}
            </time>
            {!item.read ? (
              <button onClick={() => markRead(item.id)} type="button">
                <Check size={14} />
                Đánh dấu đã đọc
              </button>
            ) : (
              <span className={styles.read}>Đã đọc</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
