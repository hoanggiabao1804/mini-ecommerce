import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useCart } from "../../../../features/cart/useCart";
import { productPath } from "../../../../features/catalog/catalog";
import { formatPrice, type Product } from "../../../../types/product";
import QuantityPicker from "../../../../components/share/QuantityPicker/QuantityPicker";
import ProductImage from "../../../../components/share/ProductImage/ProductImage";
import styles from "./CartItem.module.css";
export default function CartItem({
  product,
  quantity,
}: {
  product: Product;
  quantity: number;
}) {
  const { setQuantity, removeItem } = useCart();
  return (
    <article className={styles.item} aria-label={product.name}>
      <Link
        to={productPath(product.id)}
        className={styles.image}
        aria-label={`Xem ${product.name}`}
      >
        <ProductImage src={product.image} alt={product.name} />
      </Link>
      <div className={styles.info}>
        <span className={styles.brand}>{product.brand}</span>
        <Link className={styles.name} to={productPath(product.id)}>
          {product.name}
        </Link>
        <p className={styles.specs}>{product.specs.join(" · ")}</p>
        <p className={styles.color}>{product.color}</p>
        <span className={styles.unitPrice}>
          Đơn giá: {formatPrice(product.price)}
        </span>
        <div className={styles.controls}>
          <QuantityPicker
            label={`Số lượng ${product.name}`}
            value={quantity}
            onChange={(next) => setQuantity(product.id, next)}
          />
          <button
            type="button"
            className={styles.remove}
            aria-label={`Xóa ${product.name} khỏi giỏ`}
            onClick={() => removeItem(product.id)}
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
        {formatPrice(product.price * quantity)}
      </strong>
    </article>
  );
}
