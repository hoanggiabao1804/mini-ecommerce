import { createContext } from "react";
import type { DemoReceipt } from "../checkout/types";
export type Notification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  kind: "success" | "failure";
};
export type NotificationState = {
  items: Notification[];
  unreadCount: number;
  notifyPayment: (receipt: DemoReceipt) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
};
export const NotificationContext = createContext<NotificationState | null>(
  null,
);
