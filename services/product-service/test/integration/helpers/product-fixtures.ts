import { PrismaClient } from "../../../src/generated/prisma/client.js";
import type {
	ProductDto,
	ProductVariantDto,
} from "../../../src/types/product.js";

type ProductVariant = Omit<ProductVariantDto, "id" | "storage" | "ram"> & {
	storage?: string;
	ram?: string;
};

type Product = Omit<ProductDto, "id" | "badge" | "variants"> & {
	badge?: string;
	variants: ProductVariant[];
};

const productFixtures: Product[] = [
	{
		slug: "iphone-16",
		name: "iPhone 16",
		brand: "Apple",
		category: "phone",
		specs: ["Apple A18", "Camera Control", "Dynamic Island"],
		badge: "Nổi bật",
		description:
			"iPhone 16 mang đến thiết kế mới mẻ với cụm camera dọc, tích hợp chip A18 mạnh mẽ hỗ trợ Apple Intelligence. Màn hình Super Retina XDR hiển thị sắc nét, cùng nút Điều khiển camera hoàn toàn mới giúp bạn dễ dàng bắt trọn mọi khoảnh khắc.",
		variants: [
			// 128GB series
			{
				sku: "IP16-128-BLK",
				color: "Đen",
				storage: "128GB",
				ram: "8GB",
				price: 22_990_000,
				image: "/images/products/phone/iphone-16-black.webp",
			},
		],
	},
	{
		slug: "macbook-air-13-m3",
		name: "MacBook Air 13 inch M3",
		brand: "Apple",
		category: "laptop",
		specs: ["Apple M3", "Màn hình 13.6 inch Liquid Retina", "Pin 18 giờ"],
		description:
			"MacBook Air 13 inch M3 tiếp tục giữ vững ngôi vương thiết kế mỏng nhẹ, nay càng mạnh mẽ hơn với chip M3 đột phá. Máy hỗ trợ xuất 2 màn hình rời khi gập lại, thời lượng pin lên đến 18 giờ.",
		variants: [
			// 8GB Ram - 256GB SSD series
			{
				sku: "MBA13-M3-8-256-MID",
				color: "Đêm tinh tú",
				storage: "256GB SSD",
				ram: "8GB",
				price: 18_990_000,
				image: "/images/products/laptop/mba13-m3-midnight.webp",
			},
		],
	},
	{
		slug: "airpods-pro-2",
		name: "AirPods Pro 2",
		brand: "Apple",
		category: "audio",
		specs: ["Chip H2", "Chống ồn chủ động (ANC)", "Hộp sạc USB-C"],
		badge: "Nổi bật",
		description:
			"AirPods Pro 2 mang đến trải nghiệm âm thanh đắm chìm với tính năng Chống ồn chủ động (ANC) tốt gấp 2 lần. Chip H2 tối ưu hóa Âm thanh không gian, đi kèm cổng sạc Type-C tiện lợi.",
		variants: [
			{
				sku: "APP2-WHT",
				color: "Trắng",
				price: 4_990_000,
				image: "/images/products/audio/apple-airpods-pro-2-usb-c-white.webp",
			},
		],
	},
	{
		slug: "ipad-air-6-m2",
		name: "iPad Air 6 M2 11 inch",
		brand: "Apple",
		category: "tablet",
		specs: [
			"Apple M2",
			"Màn hình 11 inch Liquid Retina",
			"Hỗ trợ Apple Pencil Pro",
		],
		description:
			"iPad Air 11 inch (2024) nay được trang bị chip M2 siêu phàm, mang lại hiệu năng xử lý đồ họa và AI vượt trội. Biến chiếc iPad này thành công cụ sáng tạo đa năng lý tưởng.",
		variants: [
			// 128GB series
			{
				sku: "IPAA6-128-GRY",
				color: "Xám không gian",
				storage: "128GB",
				price: 16_990_000,
				image: "/images/products/tablet/ipad-air-6-m2-11-gray.webp",
			},
		],
	},
	{
		slug: "apple-watch-series-9",
		name: "Apple Watch Series 9",
		brand: "Apple",
		category: "watch",
		specs: ["Chip S9 SiP", "Double Tap", "Màn hình 2000 nits"],
		description:
			"Apple Watch Series 9 là người bạn đồng hành sức khỏe hoàn hảo, nổi bật với chip S9 SiP mạnh mẽ cho phép thao tác 'Chạm hai lần' kỳ diệu mà không cần chạm vào màn hình.",
		variants: [
			{
				sku: "AW9-41-MID",
				color: "Đêm tinh tú",
				storage: "64GB",
				price: 4_490_000,
				image: "/images/products/tablet/apple-watch-series-9-midnight.webp",
			},
		],
	},
];

async function seedProductFixtures(prisma: PrismaClient) {
	await prisma.$transaction(async (tx) => {
		for (const [pIndex, product] of productFixtures.entries()) {
			await tx.product.create({
				data: {
					slug: product.slug,
					name: product.name,
					brand: product.brand,
					category: product.category,
					specs: product.specs,
					badge: product.badge ?? null,
					description: product.description,
					displayOrder: pIndex,

					variants: {
						createMany: {
							data: product.variants.map((variant, vIndex) => ({
								sku: variant.sku,
								color: variant.color,
								storage: variant.storage ?? null,
								ram: variant.ram ?? null,
								price: variant.price,
								image: variant.image,
								displayOrder: vIndex,
							})),
						},
					},
				},
			});
		}
	});
}

async function resetProducts(prisma: PrismaClient) {
	await prisma.product.deleteMany();
}

export { productFixtures, seedProductFixtures, resetProducts };
