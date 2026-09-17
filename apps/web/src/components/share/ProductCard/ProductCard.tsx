import { ArrowUpRight, ImageOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { productPath } from "../../../features/catalog/catalog";
import { formatPrice, type Product } from "../../../types/product";
import styles from "./ProductCard.module.css";
export default function ProductCard({ product }: { product: Product }) {
  const [failed, setFailed] = useState(false);
  return (
    <article className={styles.card}>
      <Link
        className={styles.open}
        to={productPath(product.id)}
        aria-label={`Xem chi tiết ${product.name}`}
      >
        <div className={styles.visual}>
          {product.badge && (
            <span className={styles.badge}>{product.badge}</span>
          )}
          {failed ? (
            <ImageOff aria-label="Chưa có hình sản phẩm" size={48} />
          ) : (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              width="240"
              height="210"
              onError={() => setFailed(true)}
            />
          )}
        </div>
        <div className={styles.body}>
          <span className={styles.brand}>{product.brand}</span>
          <h3>{product.name}</h3>
          <div className={styles.specs}>
            {product.specs.map((spec) => (
              <span key={spec}>{spec}</span>
            ))}
          </div>
          <p className={styles.color}>{product.color}</p>
          <div className={styles.bottom}>
            <strong>{formatPrice(product.price)}</strong>
            <span className={styles.arrow}>
              <ArrowUpRight size={18} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
