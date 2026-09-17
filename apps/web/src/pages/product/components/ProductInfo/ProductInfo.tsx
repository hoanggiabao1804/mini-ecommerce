import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowRight, CheckCircle2, Check } from "lucide-react";
import { getVariants, productPath } from "../../../../features/catalog/catalog";
import { useCart } from "../../../../features/cart/useCart";
import { MAX_QUANTITY } from "../../../../features/cart/cart";
import { formatPrice, type Product } from "../../../../types/product";
import QuantityPicker from "../../../../components/share/QuantityPicker/QuantityPicker";
import styles from "./ProductInfo.module.css";
export default function ProductInfo({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const { addItem, lines } = useCart();
  const navigate = useNavigate();
  const variants = getVariants(product);
  const inCart =
    lines.find((line) => line.productId === product.id)?.quantity ?? 0;
  function add(buyNow = false) {
    const added = Math.min(quantity, MAX_QUANTITY - inCart);
    if (added > 0) addItem(product.id, added);
    setMessage(
      added > 0
        ? `Đã thêm ${added} sản phẩm vào giỏ hàng.`
        : `Giỏ đã có ${MAX_QUANTITY} sản phẩm với cấu hình này.`,
    );
    if (buyNow) navigate("/cart");
  }
  return (
    <section className={styles.info} aria-labelledby="product-title">
      <div className={styles.meta}>
        <span>{product.brand}</span>
        <span>Mã sản phẩm: {product.id}</span>
      </div>
      <h1 id="product-title">{product.name}</h1>
      <a href="#description" className={styles.readMore}>
        Xem mô tả và thông tin sản phẩm <ArrowRight size={14} />
      </a>
      <div className={styles.price}>
        <span>Giá sản phẩm</span>
        <strong>{formatPrice(product.price)}</strong>
        <p>{product.color}</p>
      </div>
      <fieldset className={styles.variants}>
        <legend>Chọn cấu hình</legend>
        <div>
          {variants.map((variant) => (
            <label
              key={variant.id}
              className={
                variant.id === product.id ? styles.selected : undefined
              }
            >
              <input
                type="radio"
                name="configuration"
                checked={variant.id === product.id}
                onChange={() => navigate(productPath(variant.id))}
                aria-label={`Cấu hình ${variant.specs.join(" · ")}`}
              />
              <span className={styles.variantSpecs}>
                {variant.specs.join(" · ")}
              </span>
              <span className={styles.variantPrice}>
                {formatPrice(variant.price)}
              </span>
              {variant.id === product.id && (
                <Check size={13} className={styles.check} />
              )}
            </label>
          ))}
        </div>
      </fieldset>
      <div className={styles.quantity}>
        <label>Số lượng</label>
        <QuantityPicker
          value={quantity}
          onChange={(next) => {
            setQuantity(next);
            setMessage("");
          }}
        />
        <span>{inCart > 0 ? `Đã có ${inCart} trong giỏ` : ""}</span>
      </div>
      <div className={styles.buttons}>
        <button type="button" className={styles.add} onClick={() => add()}>
          <ShoppingCart size={19} />
          Thêm vào giỏ hàng
        </button>
        <button type="button" className={styles.buy} onClick={() => add(true)}>
          Mua ngay
          <ArrowRight size={18} />
        </button>
      </div>
      <div className={styles.feedback} role="status">
        {message && (
          <>
            <CheckCircle2 size={17} />
            <span>
              {message} <Link to="/cart">Xem giỏ hàng</Link>
            </span>
          </>
        )}
      </div>
      <p className={styles.hint}>
        “Mua ngay” thêm cấu hình đã chọn vào giỏ và mở giỏ hàng.
      </p>
    </section>
  );
}
