import { beforeEach, describe, expect, it, vi } from "vitest";

import { mockDeep, type DeepMockProxy } from "vitest-mock-extended";

import {
	Prisma,
	PrismaClient,
	type Product,
} from "../../src/generated/prisma/client.js";
import { ProductService } from "../../src/services/product.service.js";
import { parseProductQuery } from "../../src/validators/product-query.js";
import { ProductDto } from "../../src/types/product.js";

type ProductWithVariants = Prisma.ProductGetPayload<{
	include: { variants: true };
}>;

describe("ProductService.list", () => {
	let prisma: DeepMockProxy<PrismaClient>;
	let service: ProductService;

	beforeEach(() => {
		prisma = mockDeep<PrismaClient>();
		prisma.$transaction.mockImplementation(async (callback: any) => {
			return callback(prisma);
		});
		service = new ProductService(prisma);
	});

	it("return products with pagination", async () => {
		const products: ProductWithVariants[] = [
			{
				id: 1,
				slug: "iphone-16",
				name: "iPhone 16",
				brand: "Apple",
				category: "phone",
				specs: ["Apple A18", "Camera Control", "Dynamic Island"],
				badge: "Nổi bật",
				description: "iPhone-16 description",
				variants: [
					{
						id: 1,
						productId: 1,
						sku: "IP16-128-BLK",
						color: "Đen",
						storage: "128GB",
						ram: "8GB",
						price: new Prisma.Decimal("22990000"),
						image: "/images/products/phone/iphone-16-black.webp",
						isActive: true,
						displayOrder: 0,
						createdAt: new Date("2026-01-01T00:00:00.000Z"),
					},
				],
				displayOrder: 0,
				createdAt: new Date("2026-01-01T00:00:00.000Z"),
			},
		];

		prisma.product.count.mockResolvedValue(1);
		prisma.product.findMany.mockResolvedValue(products);

		const result = await service.list({
			page: 1,
			limit: 8,
			sort: "featured",
		});

		expect(prisma.product.count).toHaveBeenCalledWith({
			where: expect.objectContaining({
				variants: {
					some: {
						isActive: true,
					},
				},
			}),
		});

		expect(prisma.product.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				include: {
					variants: {
						where: {
							isActive: true,
						},
						orderBy: [
							{
								displayOrder: "asc",
							},
							{
								id: "asc",
							},
						],
					},
				},
				orderBy: [
					{
						displayOrder: "asc",
					},
					{
						id: "asc",
					},
				],

				skip: 0,
				take: 8,
			}),
		);

		expect(result.meta).toEqual({
			page: 1,
			limit: 8,
			total: 1,
			totalPages: 1,
			hasNext: false,
		});

		expect(result.data).toHaveLength(1);
		expect(result.data[0]).toMatchObject({
			id: 1,
			slug: "iphone-16",
			variants: [
				expect.objectContaining({
					sku: "IP16-128-BLK",
					price: 22_990_000,
				}),
			],
		});
	});

	it("sorts products by minimum variant price ascending and descending", async () => {
		prisma.product.count.mockResolvedValue(2);

		const groupByMock = vi.mocked(prisma.productVariant.groupBy);
		groupByMock.mockResolvedValue([
			{
				productId: 2,

				_min: {
					price: new Prisma.Decimal("5990000"),
				},
			},

			{
				productId: 1,

				_min: {
					price: new Prisma.Decimal("22990000"),
				},
			},
		] as never);

		const products: ProductWithVariants[] = [
			{
				id: 1,
				slug: "iphone-16",
				name: "iPhone 16",
				brand: "Apple",
				category: "phone",
				specs: [],
				badge: null,
				description: "iPhone",
				displayOrder: 0,
				createdAt: new Date(),

				variants: [
					{
						id: 1,
						productId: 1,
						sku: "IP16-128-BLK",
						color: "Đen",
						storage: "128GB",
						ram: "8GB",

						price: new Prisma.Decimal("22990000"),

						image: "/iphone.webp",

						isActive: true,
						displayOrder: 0,
						createdAt: new Date(),
					},
				],
			},

			{
				id: 2,
				slug: "airpods-pro-2",
				name: "AirPods Pro 2",
				brand: "Apple",
				category: "audio",
				specs: [],
				badge: null,
				description: "AirPods",
				displayOrder: 1,
				createdAt: new Date(),

				variants: [
					{
						id: 2,
						productId: 2,
						sku: "APP2-WHT",
						color: "Trắng",
						storage: null,
						ram: null,

						price: new Prisma.Decimal("5990000"),

						image: "/airpods.webp",

						isActive: true,
						displayOrder: 0,
						createdAt: new Date(),
					},
				],
			},
		];

		prisma.product.findMany.mockResolvedValue([products[0], products[1]]);

		const resultAscending = await service.list({
			page: 1,
			limit: 8,
			sort: "asc",
		});

		expect(groupByMock).toHaveBeenCalledWith(
			expect.objectContaining({
				orderBy: {
					_min: {
						price: "asc",
					},
				},
			}),
		);

		expect(resultAscending.data.map((product) => product.id)).toEqual([
			2, 1,
		]);

		groupByMock.mockResolvedValue([
			{
				productId: 1,

				_min: {
					price: new Prisma.Decimal("22990000"),
				},
			},
			{
				productId: 2,

				_min: {
					price: new Prisma.Decimal("5990000"),
				},
			},
		] as never);

		prisma.product.findMany.mockResolvedValue([products[0], products[1]]);

		const resultDescending = await service.list({
			page: 1,
			limit: 8,
			sort: "desc",
		});

		expect(groupByMock).toHaveBeenCalledWith(
			expect.objectContaining({
				orderBy: {
					_min: {
						price: "desc",
					},
				},
			}),
		);

		expect(resultDescending.data.map((product) => product.id)).toEqual([
			1, 2,
		]);
	});
});

describe("parseProductQuery", () => {
	it("uses default pagination", () => {
		expect(parseProductQuery({})).toEqual({
			page: 1,
			limit: 8,
			category: undefined,
			brand: undefined,
			search: undefined,
			sort: "featured",
		});
	});

	it("rejects invalid page", () => {
		expect(() =>
			parseProductQuery({
				page: "0",
			}),
		).toThrow();
	});
});
