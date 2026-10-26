import { AlignLeft, SlidersHorizontal } from "lucide-react";
import { variantLabel, type Product, type ProductVariant } from "../../../../types/product";
import { categories } from "../../../../config/categories";
import styles from "./ProductDescription.module.css";
export default function ProductDescription({ product, selected }: { product: Product; selected: ProductVariant }) {
	return (
		<section
			id="description"
			className={styles.section}
			aria-label="Mô tả và thông tin sản phẩm"
		>
			<article className={styles.description}>
				<h2>
					<AlignLeft size={21} />
					Mô tả sản phẩm
				</h2>
				<h3>{product.name}</h3>
				<p>
					{product.description ||
						"Mô tả sản phẩm đang được cập nhật."}
				</p>
			</article>
			<aside className={styles.specifications}>
				<h2>
					<SlidersHorizontal size={20} />
					Thông tin phiên bản
				</h2>
				<dl>
					<div>
						<dt>Thương hiệu</dt>
						<dd>{product.brand}</dd>
					</div>
					<div>
						<dt>Danh mục</dt>
						<dd>
							{
								categories.find(
									(item) => item.id === product.category,
								)?.label
							}
						</dd>
					</div>
					<div>
						<dt>Cấu hình</dt>
						<dd>{[...product.specs, variantLabel(selected)].join(" · ")}</dd>
					</div>
					<div>
						<dt>Đặc điểm</dt>
						<dd>{selected.color}</dd>
					</div>
					<div>
						<dt>Mã sản phẩm</dt>
						<dd>{selected.sku}</dd>
					</div>
				</dl>
			</aside>
		</section>
	);
}
