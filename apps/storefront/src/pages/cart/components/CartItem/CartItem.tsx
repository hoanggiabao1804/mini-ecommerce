import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useCart } from "../../../../features/cart/useCart";
import { productPath } from "../../../../features/catalog/catalog";
import { formatPrice, type Product, type ProductVariant } from "../../../../types/product";
import QuantityPicker from "../../../../components/share/QuantityPicker/QuantityPicker";
import ProductImage from "../../../../components/share/ProductImage/ProductImage";
import styles from "./CartItem.module.css";

interface CartItemProps {
	product: Product;
	variant: ProductVariant;
	quantity: number;
}

export default function CartItem({
	product,
	variant,
	quantity,
}: CartItemProps) {
	const { setQuantity, removeItem } = useCart();
	return (
		<article className={styles.item} aria-label={product.name}>
			<Link
				to={productPath(product.slug)}
				className={styles.image}
				aria-label={`Xem ${product.name}`}
			>
				<ProductImage src={variant.image} alt={product.name} />
			</Link>
			<div className={styles.info}>
				<span className={styles.brand}>{product.brand}</span>
				<Link className={styles.name} to={productPath(product.slug)}>
					{product.name}
				</Link>
				<p className={styles.specs}>{[variant.storage,variant.ram].filter(Boolean).join(" · ") || "Phiên bản tiêu chuẩn"}</p>
				<p className={styles.color}>{variant.color}</p>
				<span className={styles.unitPrice}>
					Đơn giá: {formatPrice(variant.price)}
				</span>
				<div className={styles.controls}>
					<QuantityPicker
						label={`Số lượng ${product.name}`}
						value={quantity}
						onChange={(next) => setQuantity(variant.id, next)}
					/>
					<button
						type="button"
						className={styles.remove}
						aria-label={`Xóa ${product.name} khỏi giỏ`}
						onClick={() => removeItem(variant.id)}
					>
						<Trash2 size={15} />
						Xóa
					</button>
				</div>
			</div>
			<strong
				className={styles.subtotal}
				aria-label={`Thành tiền ${product.name}`}
			>
				{formatPrice(variant.price * quantity)}
			</strong>
		</article>
	);
}
