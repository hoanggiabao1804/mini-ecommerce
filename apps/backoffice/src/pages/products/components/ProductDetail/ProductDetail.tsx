import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { ProductThumbnail } from "../../../../components/share/ProductThumbnail/ProductThumbnail";
import type { Product } from "../../../../types/product";
import { categoryLabels, formatPrice } from "../../../../types/product";
import styles from "./ProductDetail.module.css";

type Props = { product: Product; onClose: () => void };

export function ProductDetail({ product, onClose }: Props) {
	const variantsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const frame = requestAnimationFrame(() => {
			variantsRef.current?.scrollIntoView({
				behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
					.matches
					? "auto"
					: "smooth",
				block: "start",
			});
		});
		return () => cancelAnimationFrame(frame);
	}, [product.id]);

	return (
		<section
			className={styles.panel}
			aria-label={`Chi tiết ${product.name}`}
		>
			<div className={styles.head}>
				<div>
					<span className={styles.eyebrow}>CHI TIẾT SẢN PHẨM</span>
					<h2>{product.name}</h2>
					<p>
						{product.brand} · {categoryLabels[product.category]} ·
						ID #{product.id}
					</p>
				</div>
				<button
					type="button"
					onClick={onClose}
					aria-label="Đóng chi tiết"
				>
					<X size={18} />
				</button>
			</div>
			<div className={styles.body}>
				<div className={styles.labelRow} ref={variantsRef}>
					<strong>Các phiên bản</strong>
					<span>{product.variants.length} SKU đang hiển thị</span>
				</div>
				<div className={styles.variantList}>
					{product.variants.length ? (
						product.variants.map((variant) => (
							<div className={styles.variant} key={variant.id}>
								<ProductThumbnail
									src={variant.image}
									size="medium"
								/>
								<div className={styles.variantInfo}>
									<strong>
										{[
											variant.storage,
											variant.ram,
											variant.color,
										]
											.filter(Boolean)
											.join(" · ") || variant.sku}
									</strong>
									<span>SKU: {variant.sku}</span>
								</div>
								<span className={styles.price}>
									{formatPrice(variant.price)}
								</span>
							</div>
						))
					) : (
						<p className={styles.muted}>
							Sản phẩm chưa có phiên bản đang hiển thị.
						</p>
					)}
				</div>
				{product.specs.length > 0 && (
					<div className={styles.section}>
						<strong>Thông số</strong>
						<div className={styles.specs}>
							{product.specs.map((spec, index) => (
								<span key={`${index}-${spec}`}>{spec}</span>
							))}
						</div>
					</div>
				)}
				{product.description && (
					<div className={styles.section}>
						<strong>Mô tả</strong>
						<p>{product.description}</p>
					</div>
				)}
			</div>
			<div className={styles.note}>
				Dữ liệu hiển thị từ Product Service. Các thao tác chỉnh sửa sẽ
				được bổ sung khi luồng quản trị hoàn thiện.
			</div>
		</section>
	);
}
