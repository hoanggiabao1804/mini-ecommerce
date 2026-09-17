import { ArrowRight, LoaderCircle } from "lucide-react";
import { Link } from "react-router-dom";
import type { CheckoutItem } from "../../../../features/checkout/types";
import { formatPrice } from "../../../../types/product";
import ProductImage from "../../../../components/share/ProductImage/ProductImage";
import styles from "./OrderSummary.module.css";
export default function OrderSummary({
  items,
  total,
  pending,
}: {
  items: CheckoutItem[];
  total: number;
  pending: boolean;
}) {
  return (
    <aside className={styles.summary} aria-labelledby="order-title">
      <div className={styles.heading}>
        <h2 id="order-title">Đơn hàng của bạn</h2>
        <Link to="/cart">Sửa giỏ hàng</Link>
      </div>
      <div className={styles.items}>
        {items.map(({ product, quantity }) => (
          <article key={product.id} className={styles.item}>
            <div className={styles.image}>
              <ProductImage src={product.image} alt={product.name} />
            </div>
            <div>
              <h3>{product.name}</h3>
              <p>{product.specs.join(" · ")}</p>
              <span>Số lượng: {quantity}</span>
              <strong>{formatPrice(product.price * quantity)}</strong>
            </div>
          </article>
        ))}
      </div>
      <dl>
        <div>
          <dt>Tạm tính</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
        <div>
          <dt>Phí giao hàng (demo)</dt>
          <dd>{formatPrice(0)}</dd>
        </div>
      </dl>
      <div className={styles.total}>
        <span>Tổng thanh toán</span>
        <strong>{formatPrice(total)}</strong>
      </div>
      <button
        type="submit"
        form="checkout-form"
        disabled={pending}
        className={styles.pay}
      >
        {pending ? (
          <>
            <LoaderCircle size={18} className={styles.spinner} />
            Đang xử lý…
          </>
        ) : (
          <>
            Thanh toán demo <ArrowRight size={18} />
          </>
        )}
      </button>
      <p className={styles.notice} role="status">
        {pending
          ? "Đang mô phỏng kết quả. Vui lòng chờ trong giây lát."
          : "Đây là giao dịch mô phỏng. Không có khoản tiền thực tế nào bị trừ."}
      </p>
    </aside>
  );
}
