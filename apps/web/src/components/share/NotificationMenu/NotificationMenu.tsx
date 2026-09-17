import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import { useNotifications } from "../../../features/notifications/useNotifications";
import NotificationList from "../NotificationList/NotificationList";
import styles from "./NotificationMenu.module.css";
function Menu() {
  const { items, unreadCount, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  return (
    <div
      ref={root}
      className={styles.root}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node))
          setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        className={styles.trigger}
        aria-label={`Thông báo, ${unreadCount} chưa đọc`}
        aria-expanded={open}
        aria-controls="notification-panel"
        onClick={() => setOpen(!open)}
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <strong className={styles.badge}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </strong>
        )}
      </button>
      {open && (
        <section
          id="notification-panel"
          className={styles.panel}
          aria-label="Thông báo gần đây"
        >
          <div className={styles.heading}>
            <h2>Thông báo</h2>
            <span>{unreadCount} chưa đọc</span>
          </div>
          {unreadCount > 0 && (
            <button type="button" className={styles.mark} onClick={markAllRead}>
              Đánh dấu tất cả đã đọc
            </button>
          )}
          <div className={styles.scroll}>
            <NotificationList items={items.slice(0, 4)} />
          </div>
          <Link className={styles.all} to="/notifications">
            Xem tất cả thông báo
          </Link>
        </section>
      )}
    </div>
  );
}
export default function NotificationMenu() {
  const location = useLocation();
  return <Menu key={location.key} />;
}
