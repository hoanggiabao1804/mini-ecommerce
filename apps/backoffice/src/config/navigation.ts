import {
	Bell,
	Boxes,
	ChartNoAxesCombined,
	ClipboardList,
	CreditCard,
	History,
	LayoutDashboard,
	Settings2,
	ShieldCheck,
	Tag,
	Users,
} from "lucide-react";

export const navigation = [
	{
		label: "Tổng quan",
		path: "/dashboard",
		icon: LayoutDashboard,
		ready: true,
	},
	{ label: "Sản phẩm", path: "/products", icon: Boxes, ready: true },
	{ label: "Tồn kho", path: "/inventory", icon: ClipboardList, ready: false },
	{
		label: "Đơn hàng",
		path: "/orders",
		icon: ChartNoAxesCombined,
		ready: false,
	},
	{ label: "Người dùng", path: "/users", icon: Users, ready: false },
	{ label: "Thanh toán", path: "/payments", icon: CreditCard, ready: false },
	{ label: "Khuyến mãi", path: "/promotions", icon: Tag, ready: false },
	{ label: "Thông báo", path: "/notifications", icon: Bell, ready: false },
	{ label: "Nhật ký", path: "/audit-logs", icon: History, ready: false },
	{ label: "Vận hành", path: "/operations", icon: ShieldCheck, ready: false },
	{ label: "Cài đặt", path: "/settings", icon: Settings2, ready: false },
] as const;

export const sections = [
	{
		label: "WORKSPACE",
		paths: ["/dashboard", "/products", "/inventory", "/orders", "/users"],
	},
	{
		label: "QUẢN TRỊ",
		paths: ["/payments", "/promotions", "/notifications", "/audit-logs"],
	},
	{ label: "HỆ THỐNG", paths: ["/operations", "/settings"] },
] as const;
