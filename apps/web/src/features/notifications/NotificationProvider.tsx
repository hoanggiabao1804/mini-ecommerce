import { useState, type ReactNode } from "react";
import { useAuth } from "../auth/useAuth";
import { NotificationContext, type Notification } from "./NotificationContext";
export default function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();
  const owner = user?.id ?? "guest";
  const [inboxes, setInboxes] = useState<Record<string, Notification[]>>({});
  const items = inboxes[owner] ?? [];
  function setItems(update: (current: Notification[]) => Notification[]) {
    setInboxes((current) => ({
      ...current,
      [owner]: update(current[owner] ?? []),
    }));
  }
  return (
    <NotificationContext.Provider
      value={{
        items,
        unreadCount: items.filter((item) => !item.read).length,
        notifyPayment: (receipt) =>
          setItems((current) => {
            if (current.some((item) => item.id === receipt.reference))
              return current;
            const success = receipt.outcome === "success";
            return [
              {
                id: receipt.reference,
                kind: receipt.outcome,
                title: success
                  ? "Thanh toán demo thành công"
                  : "Thanh toán demo chưa thành công",
                message: success
                  ? `Giao dịch ${receipt.reference} đã được mô phỏng thành công. Tổng tiền ${receipt.total.toLocaleString("vi-VN")}đ. Đây không phải đơn hàng hoặc khoản thanh toán thật.`
                  : `Giao dịch ${receipt.reference} chưa thành công. Giỏ hàng được giữ nguyên; bạn có thể quay lại giỏ để thử thanh toán.`,
                createdAt: new Date().toISOString(),
                read: false,
              },
              ...current,
            ].slice(0, 100);
          }),
        markRead: (id) =>
          setItems((current) =>
            current.map((item) =>
              item.id === id ? { ...item, read: true } : item,
            ),
          ),
        markAllRead: () =>
          setItems((current) =>
            current.map((item) => ({ ...item, read: true })),
          ),
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
