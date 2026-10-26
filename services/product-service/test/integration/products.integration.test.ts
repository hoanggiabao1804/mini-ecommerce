import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import request from "supertest";

import { createApp } from "../../src/app.js";

import {
	createIntegrationDatabase,
	destroyIntegrationDatabase,
	type IntegrationDatabase,
} from "./helpers/test-database.js";

import {
	productFixtures,
	resetProducts,
	seedProductFixtures,
} from "./helpers/product-fixtures.js";
import { ProductDto } from "../../src/types/product.js";

describe("Product API integration", () => {
	let database: IntegrationDatabase;

	beforeAll(async () => {
		database = await createIntegrationDatabase();
	});

	beforeEach(async () => {
		await resetProducts(database.prisma);
		await seedProductFixtures(database.prisma);
	});

	afterAll(async () => {
		await destroyIntegrationDatabase(database);
	});

	it("GET /products returns products with pagination", async () => {
		const app = createApp(database.prisma);

		const response = await request(app).get("/products").expect(200);

		expect(response.body.data).toHaveLength(5);

		expect(response.body.meta).toEqual({
			page: 1,
			limit: 8,
			total: 5,
			totalPages: 1,
			hasNext: false,
		});

		expect(
			response.body.data.map((product: { slug: string }) => product.slug),
		).toEqual(productFixtures.map((product) => product.slug));
	});

	it("supports pagination", async () => {
		const app = createApp(database.prisma);

		const response = await request(app)
			.get("/products")
			.query({ page: 2, limit: 2 })
			.expect(200);

		expect(response.body.data).toHaveLength(2);

		expect(response.body.meta).toEqual({
			page: 2,
			limit: 2,
			total: 5,
			totalPages: 3,
			hasNext: true,
		});
	});

	it("filters products by category", async () => {
		const app = createApp(database.prisma);

		const response = await request(app)
			.get("/products")
			.query({
				category: "phone",
			})
			.expect(200);

		expect(response.body.data).toHaveLength(1);

		expect(
			response.body.data.every(
				(product: { category: string }) => "phone" === product.category,
			),
		).toBe(true);
	});

	it("combines category and brand filters", async () => {
		const app = createApp(database.prisma);

		const response = await request(app)
			.get("/products")
			.query({ category: "phone", brand: "Apple" })
			.expect(200);

		expect(response.body.data).toHaveLength(1);

		expect(response.body.data[0]).toMatchObject({
			brand: "Apple",
			category: "phone",
		});
	});

	it("searches by product name", async () => {
		const app = createApp(database.prisma);

		const response = await request(app)
			.get("/products")
			.query({ search: "iphone" })
			.expect(200);

		expect(response.body.data).toHaveLength(1);

		expect(response.body.data[0].name).toContain("iPhone");
	});

	it("sorts products by price descending", async () => {
		const app = createApp(database.prisma);

		const response = await request(app)
			.get("/products")
			.query({ sort: "desc" })
			.expect(200);

		const minPrices = response.body.data.map((product: ProductDto) =>
			Math.min(...product.variants.map((variant) => variant.price)),
		);

		expect(minPrices).toEqual([...minPrices].sort((a, b) => b - a));
	});

	it("returns 400 for invalid category", async () => {
		const app = createApp(database.prisma);

		const response = await request(app)
			.get("/products")
			.query({ category: "banana" })
			.expect(400);

		expect(response.body).toEqual({ error: "Invalid category" });
	});

	it("database rejects negative product prices", async () => {
		await expect(
			database.prisma.product.create({
				data: {
					slug: "invalid-price",
					name: "Invalid Product",
					brand: "Test",
					category: "phone",
					specs: [],
					badge: "Invalid",
					description: "Invalid product with negative price",
					displayOrder: 100,
					variants: {
						createMany: {
							data: [
								{
									sku: "invalid-sku",
									color: "Black",
									storage: "128GB",
									ram: "8GB",
									price: -1,
									image: "/images/invalid-phone.webp",
									displayOrder: 0,
								},
							],
						},
					},
				},
			}),
		).rejects.toThrow();
	});

	it("database rejects unsupported categories", async () => {
		await expect(
			database.prisma.product.create({
				data: {
					slug: "invalid-category",
					name: "Invalid Product",
					brand: "Test",
					category: "banana",
					specs: [],
					badge: "Invalid",
					description: "Invalid product with negative price",
					displayOrder: 100,
					variants: {
						createMany: {
							data: [
								{
									sku: "invalid-sku",
									color: "Black",
									storage: "128GB",
									ram: "8GB",
									price: -1,
									image: "/images/invalid-phone.webp",
									displayOrder: 0,
								},
							],
						},
					},
				},
			}),
		).rejects.toThrow();
	});
	it("PATCH updates multiple variants atomically and leaves omitted variants unchanged", async () => {
		const app = createApp(database.prisma);
		const original = await request(app).get("/products/iphone-16").expect(200);
		const product = original.body as ProductDto;
		const first = product.variants[0];
		const result = await request(app)
			.patch(`/products/${product.id}`)
			.send({
				name: "iPhone 16 Updated",
				badge: null,
				variants: [
					{ id: first.id, price: 23_500_000, color: "Xanh" },
					{ sku: "IP16-256-PNK-TEST", color: "Hồng", storage: "256GB", price: 25_000_000, image: "/images/iphone-pink.webp" },
				],
			})
			.expect(200);
		expect(result.body).toMatchObject({ name: "iPhone 16 Updated", badge: null });
		expect(result.body.variants).toHaveLength(2);
		expect(result.body.variants[0]).toMatchObject({ id: first.id, color: "Xanh", price: 23_500_000 });
		expect(result.body.variants[1]).toMatchObject({ sku: "IP16-256-PNK-TEST", storage: "256GB", price: 25_000_000 });
		const followUp = await request(app)
			.patch(`/products/${product.id}`)
			.send({ variants: [{ id: first.id, ram: null }] })
			.expect(200);
		expect(followUp.body.variants).toHaveLength(2);
		expect(followUp.body.variants[0].ram).toBeNull();
		expect(followUp.body.variants[1]).toMatchObject({ sku: "IP16-256-PNK-TEST", price: 25_000_000 });
		const unchanged = await database.prisma.product.findUniqueOrThrow({ where: { slug: "macbook-air-13-m3" }, include: { variants: true } });
		expect(unchanged.variants).toHaveLength(1);
	});

	it("PATCH rejects a foreign variant and rolls back parent fields", async () => {
		const app = createApp(database.prisma);
		const product = (await request(app).get("/products/iphone-16")).body as ProductDto;
		const other = (await request(app).get("/products/macbook-air-13-m3")).body as ProductDto;
		await request(app).patch(`/products/${product.id}`).send({ name: "Should roll back", variants: [{ id: other.variants[0].id, price: 1 }] }).expect(400);
		const after = (await request(app).get("/products/iphone-16")).body as ProductDto;
		expect(after.name).toBe(product.name);
		expect(other.variants[0].price).toBeGreaterThan(1);
	});

	it("PATCH maps duplicate SKU to 409 and keeps all earlier edits rolled back", async () => {
		const app = createApp(database.prisma);
		const product = (await request(app).get("/products/iphone-16")).body as ProductDto;
		const other = (await request(app).get("/products/macbook-air-13-m3")).body as ProductDto;
		await request(app).patch(`/products/${product.id}`).send({
			name: "Should roll back",
			variants: [
				{ id: product.variants[0].id, price: 10_000_000 },
				{ sku: other.variants[0].sku, color: "Đen", price: 1_000_000, image: "/images/new.webp" },
			],
		}).expect(409);
		const after = (await request(app).get("/products/iphone-16")).body as ProductDto;
		expect(after.name).toBe(product.name);
		expect(after.variants[0].price).toBe(product.variants[0].price);
	});

	it("PATCH can deactivate a variant without deleting its id", async () => {
		const app = createApp(database.prisma);
		const product = (await request(app).get("/products/iphone-16")).body as ProductDto;
		const variantId = product.variants[0].id;
		const response = await request(app).patch(`/products/${product.id}`).send({ variants: [{ id: variantId, isActive: false }] }).expect(200);
		expect(response.body.variants).toEqual([]);
		const row = await database.prisma.productVariant.findUniqueOrThrow({ where: { id: variantId } });
		expect(row.isActive).toBe(false);
	});

	it("PATCH validates product id, body and duplicate variant ids", async () => {
		const app = createApp(database.prisma);
		const product = (await request(app).get("/products/iphone-16")).body as ProductDto;
		await request(app).patch("/products/abc").send({ name: "X" }).expect(400);
		await request(app).patch(`/products/${product.id}`).send({ variants: [] }).expect(400);
		await request(app).patch(`/products/${product.id}`).send({ variants: [{ id: product.variants[0].id, price: 100 }, { id: product.variants[0].id, color: "X" }] }).expect(400);
		await request(app).patch("/products/999999").send({ name: "Missing" }).expect(404);
		await request(app).patch(`/products/${product.id}`).send({ slug: "macbook-air-13-m3" }).expect(409);
		await request(app).patch(`/products/${product.id}`).send({ variants: [{ sku: "NEW", color: "Đen", price: 0, image: "/new.webp" }] }).expect(400);
	});

});
