import { ChevronRight } from "lucide-react";
import { ProductThumbnail } from "../../../../components/share/ProductThumbnail/ProductThumbnail";
import type { Product } from "../../../../types/product";
import { categoryLabels, formatPrice } from "../../../../types/product";
import styles from "./ProductTable.module.css";

type Props = {
	products: Product[];
	selectedId: number | null;
	onSelect: (product: Product) => void;
};

export function ProductTable({ products, selectedId, onSelect }: Props) {
	return (
		<div className={styles.scroll}>
			<table className={styles.table}>
				<thead>
					<tr>
						<th>SẢN PHẨM</th>
						<th>DANH MỤC</th>
						<th>PHIÊN BẢN</th>
						<th>GIÁ TỪ</th>
						<th>
							<span className={styles.srOnly}>Chi tiết</span>
						</th>
					</tr>
				</thead>
				<tbody>
					{products.map((product) => {
						const firstVariant = product.variants[0];
						const minPrice = product.variants.length
							? Math.min(
									...product.variants.map(
										(variant) => variant.price,
									),
								)
							: null;
						return (
							<tr
								key={product.id}
								className={
									selectedId === product.id
										? styles.selected
										: ""
								}
							>
								<td>
									<div className={styles.productCell}>
										<ProductThumbnail
											key={firstVariant?.image}
											src={firstVariant?.image}
										/>
										<span className={styles.productText}>
											<strong>{product.name}</strong>
											<small>
												{product.brand} · #{product.id}
											</small>
										</span>
									</div>
								</td>
								<td>
									<span className={styles.category}>
										{categoryLabels[product.category]}
									</span>
								</td>
								<td>
									<span className={styles.variantCount}>
										{product.variants.length} SKU
									</span>
								</td>
								<td>
									<strong className={styles.price}>
										{minPrice === null
											? "—"
											: formatPrice(minPrice)}
									</strong>
								</td>
								<td>
									<button
										type="button"
										className={styles.view}
										onClick={() => onSelect(product)}
										aria-label={`Xem chi tiết ${product.name}`}
									>
										<ChevronRight size={19} />
									</button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
