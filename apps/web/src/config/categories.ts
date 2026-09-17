import { Headphones, Laptop, Smartphone, Tablet, Watch } from "lucide-react";
import type { CategoryId } from "../types/product";
export const categories: {
	id: CategoryId;
	label: string;
	icon: typeof Smartphone;
	image: string;
}[] = [
	{
		id: "phone",
		label: "Điện thoại",
		icon: Smartphone,
		image: "/images/products/iphone.png",
	},
	{
		id: "laptop",
		label: "Laptop",
		icon: Laptop,
		image: "/images/products/macbook.jpg",
	},
	{
		id: "tablet",
		label: "Máy tính bảng",
		icon: Tablet,
		image: "/images/products/ipad.jpg",
	},
	{
		id: "audio",
		label: "Âm thanh",
		icon: Headphones,
		image: "/images/products/airpods.png",
	},
	{
		id: "watch",
		label: "Đồng hồ thông minh",
		icon: Watch,
		image: "/images/products/watch.jpg",
	},
];
