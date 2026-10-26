import { Prisma, type PrismaClient } from "../generated/prisma/client.js";
import type {
	Category,
	CreateProductRequestDto,
	ProductDto,
	ProductQuery,
	RelatedProductsQuery,
	ResultPagination,
	UpdateProductRequestDto,
} from "../types/product.js";
import { ProductVariantWhereInput } from "../generated/prisma/models.js";
import {
	BadRequest,
	Conflict,
	NotFound,
} from "../middlewares/error-handler.js";

class ProductService {
	constructor(private readonly prisma: PrismaClient) {}

	async list(query: ProductQuery): Promise<ResultPagination<ProductDto[]>> {
		const whereFeatured = {
			...(query.category && {
				category: query.category,
			}),

			...(query.brand && {
				brand: {
					equals: query.brand,
					mode: "insensitive" as const,
				},
			}),

			...(query.search && {
				OR: [
					{
						name: {
							contains: query.search,
							mode: "insensitive" as const,
						},
					},
					{
						brand: {
							contains: query.search,
							mode: "insensitive" as const,
						},
					},
				],
			}),

			variants: {
				some: {
					isActive: true,
				},
			},
		};

		const whereGroup: ProductVariantWhereInput = {
			isActive: true,
			product: {
				is: {
					...(query.category && {
						category: query.category,
					}),

					...(query.brand && {
						brand: {
							equals: query.brand,
							mode: "insensitive",
						},
					}),

					...(query.search && {
						OR: [
							{
								name: {
									contains: query.search,
									mode: "insensitive",
								},
							},
							{
								brand: {
									contains: query.search,
									mode: "insensitive",
								},
							},
						],
					}),
				},
			},
		};

		const skip = (query.page - 1) * query.limit;

		return await this.prisma.$transaction(
			async (tx) => {
				const total = await tx.product.count({
					where: whereFeatured,
				});

				let products;

				if (query.sort === "featured") {
					products = await tx.product.findMany({
						where: whereFeatured,
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
						skip,
						take: query.limit,
					});
				} else {
					const groups = await tx.productVariant.groupBy({
						by: ["productId"],

						where: whereGroup,

						_min: {
							price: true,
						},

						orderBy: {
							_min: {
								price: query.sort === "asc" ? "asc" : "desc",
							},
						},

						skip,
						take: query.limit,
					});

					const ids = groups.map((group) => group.productId);

					const rows = await tx.product.findMany({
						where: {
							id: {
								in: ids,
							},
						},

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
					});

					const productById = new Map(
						rows.map((product) => [product.id, product]),
					);

					products = ids
						.map((id) => productById.get(id))
						.filter((product) => product !== undefined);
				}

				const result: ResultPagination<ProductDto[]> = {
					data: products.map(this.toProductDto),

					meta: {
						page: query.page,
						limit: query.limit,
						total,
						totalPages: Math.ceil(total / query.limit),
						hasNext: query.page * query.limit < total,
					},
				};

				return result;
			},
			{
				isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
			},
		);
	}

	async findBySlug(slug: string): Promise<ProductDto> {
		if (!slug || slug.trim().length === 0) {
			throw new BadRequest("Product's slug cannot be empty");
		}

		slug = slug.trim();

		const result = await this.prisma.product
			.findUniqueOrThrow({
				where: {
					slug,
				},
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
			})
			.catch((error) => {
				throw new NotFound(`Not found product with slug '${slug}'`);
			});

		return this.toProductDto(result);
	}

	async findRelatedProducts(
		relatedProductQuery: RelatedProductsQuery,
	): Promise<ProductDto[]> {
		const { limit, id } = relatedProductQuery;

		if (limit < 1 || id < 1) {
			throw new BadRequest(
				"Limit and product ID must be a positive integer",
			);
		}

		const current = await this.prisma.product.findUnique({
			where: {
				id: id,
			},

			select: {
				id: true,
				category: true,
			},
		});

		if (!current) {
			throw new NotFound(`Product '${id}' not found`);
		}

		const where = {
			...(id && { id: { not: id } }),
			category: current.category,
			variants: {
				some: {
					isActive: true,
				},
			},
		};

		const products = await this.prisma.product.findMany({
			where,
			include: {
				variants: {
					where: {
						isActive: true,
					},
					orderBy: [
						{ displayOrder: "asc" as const },
						{ id: "asc" as const },
					],
					take: 2,
				},
			},
			take: Math.min(limit, 4),
		});

		return products.map(this.toProductDto);
	}

	async create(
		createRequestDto: CreateProductRequestDto,
	): Promise<ProductDto> {
		const {
			slug,
			name,
			brand,
			category,
			specs,
			badge,
			description,
			variants,
		} = createRequestDto;

		if (await this.existsBySlug(slug)) {
			throw new Conflict(`Product with slug '${slug}' is used`);
		}

		for (const variant of variants) {
			if (await this.existsBySku(variant.sku)) {
				throw new Conflict(
					`Product variant's sku '${variant.sku}' is used`,
				);
			}
		}

		const newProduct = await this.prisma.product.create({
			data: {
				slug,
				name,
				brand,
				category,
				specs,
				badge: badge ?? null,
				description,
				variants: {
					createMany: {
						data: variants.map((variant, vIndex) => ({
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
			include: {
				variants: {
					orderBy: [
						{ displayOrder: "asc" as const },
						{ id: "asc" as const },
					],
				},
			},
		});

		return this.toProductDto(newProduct);
	}

	async update(updateRequestDto: UpdateProductRequestDto): Promise<ProductDto> {
		const { id, variants, ...productChanges } = updateRequestDto;
		try {
			return await this.prisma.$transaction(async (tx) => {
				const current = await tx.product.findUnique({
					where: { id },
					include: { variants: { select: { id: true, displayOrder: true } } },
				});
				if (!current) throw new NotFound(`Product ${id} not found`);

				const ownedIds = new Set(current.variants.map((variant) => variant.id));
				for (const variant of variants ?? []) {
					if (variant.id !== undefined && !ownedIds.has(variant.id)) {
						throw new BadRequest(`Variant ${variant.id} does not belong to product ${id}`);
					}
				}

				if (Object.keys(productChanges).length) {
					await tx.product.update({ where: { id }, data: productChanges });
				}

				let nextOrder = Math.max(-1, ...current.variants.map((variant) => variant.displayOrder)) + 1;
				for (const variant of variants ?? []) {
					if (variant.id !== undefined) {
						const { id: variantId, ...changes } = variant;
						const result = await tx.productVariant.updateMany({
							where: { id: variantId, productId: id },
							data: changes,
						});
						if (result.count !== 1) throw new NotFound(`Variant ${variantId} no longer exists`);
					} else {
						await tx.productVariant.create({
							data: {
								productId: id,
								sku: variant.sku,
								color: variant.color,
								storage: variant.storage ?? null,
								ram: variant.ram ?? null,
								price: variant.price,
								image: variant.image,
								isActive: variant.isActive ?? true,
								displayOrder: variant.displayOrder ?? nextOrder++,
							},
						});
					}
				}

				const updated = await tx.product.findUniqueOrThrow({
					where: { id },
					include: {
						variants: {
							where: { isActive: true },
							orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
						},
					},
				});
				return this.toProductDto(updated);
			}, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2002") throw new Conflict("Product slug or variant SKU is already in use");
				if (error.code === "P2034") throw new Conflict("Product changed concurrently; please retry");
			}
			throw error;
		}
	}

	async existsById(id: number): Promise<boolean> {
		const countProduct = await this.prisma.product.count({
			where: { id: id },
		});

		return countProduct > 0;
	}

	async existsBySlug(slug: string): Promise<boolean> {
		if (!slug || slug.trim().length === 0) {
			return false;
		}

		const countProduct = await this.prisma.product.count({
			where: { slug: slug },
		});

		return countProduct > 0;
	}

	async existsBySku(sku: string): Promise<boolean> {
		if (!sku || sku.trim().length === 0) {
			return false;
		}

		const countVariant = await this.prisma.productVariant.count({
			where: { sku: sku },
		});

		return countVariant > 0;
	}

	toProductDto(product: ProductWithVariants): ProductDto {
		return {
			id: product.id,
			slug: product.slug,
			name: product.name,
			brand: product.brand,
			category: product.category as Category,
			specs: product.specs,
			badge: product.badge,
			description: product.description,

			variants: product.variants.map((variant) => ({
				id: variant.id,
				sku: variant.sku,
				color: variant.color,
				storage: variant.storage,
				ram: variant.ram,
				price: variant.price.toNumber(),
				image: variant.image,
			})),
		};
	}
}

type ProductWithVariants = Prisma.ProductGetPayload<{
	include: { variants: true };
}>;

export { ProductService };
