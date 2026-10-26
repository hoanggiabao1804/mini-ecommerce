import { prisma } from "../src/libs/prisma";
import { products } from "../src/database/seeds/products.js";

async function main() {
	const count = await prisma.product.count();

	if (count > 0) {
		console.log("Products already seeded");
		return;
	}

	await prisma.$transaction(async (tx) => {
		for (const [pIndex, product] of products.entries()) {
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

	console.log(`Product seed completed: ${products.length} products`);
}

main()
	.catch((error) => {
		console.error("Product seed failed:", error);

		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
