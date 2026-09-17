import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  CircleCheck,
  CircleX,
  ArrowRight,
  RotateCcw,
  MapPin,
} from "lucide-react";
import type { DemoReceipt } from "../../../../features/checkout/types";
import { formatPrice } from "../../../../types/product";
import styles from "./CheckoutResult.module.css";
export default function CheckoutResult({
  receipt,
  onRetry,
}: {
  receipt: DemoReceipt;
  onRetry: () => void;
}) {
  const success = receipt.outcome === "success";
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  return (
    <section className={`${styles.result} ${success ? "" : styles.failure}`}>
      <span className={styles.icon}>
        {success ? (
          <CircleCheck size={44} strokeWidth={1.4} />
        ) : (
          <CircleX size={44} strokeWidth={1.4} />
        )}
      </span>
      <span className={styles.eyebrow}>KẾT QUẢ MÔ PHỎNG</span>
      <h1 ref={heading} tabIndex={-1}>
        {success
          ? "Thanh toán demo thành công"
          : "Thanh toán demo chưa thành công"}
      </h1>
      <p className={styles.description}>
        {success
          ? "Bạn đã hoàn tất luồng mua sắm thử nghiệm. Không có giao dịch tiền thật hay đơn hàng thực tế được tạo."
          : "Giao dịch được mô phỏng thất bại. Sản phẩm vẫn ở trong giỏ và thông tin nhận hàng được giữ lại để bạn thử lại."}
      </p>
      <div className={styles.receipt}>
        <div>
          <span>Mã tham chiếu demo</span>
          <strong>{receipt.reference}</strong>
        </div>
        <div>
          <span>Tổng tiền mô phỏng</span>
          <strong>{formatPrice(receipt.total)}</strong>
        </div>
      </div>
      <div className={styles.delivery}>
        <MapPin size={19} />
        <div>
          <strong>
            {receipt.delivery.recipient} · {receipt.delivery.phone}
          </strong>
          <p>
            {receipt.delivery.street}, {receipt.delivery.city}
          </p>
          <p>{receipt.delivery.email}</p>
          {receipt.delivery.note && <p>Ghi chú: {receipt.delivery.note}</p>}
        </div>
      </div>
      <div className={styles.items}>
        {receipt.items.map(({ product, quantity }) => (
          <div key={product.id}>
            <span>
              {product.name}
              <small>
                {product.specs.join(" · ")} · SL: {quantity}
              </small>
            </span>
            <strong>{formatPrice(product.price * quantity)}</strong>
          </div>
        ))}
      </div>
      <div className={styles.actions}>
        {success ? (
          <Link to="/#products">
            Tiếp tục mua sắm <ArrowRight size={17} />
          </Link>
        ) : (
          <button type="button" onClick={onRetry}>
            <RotateCcw size={16} />
            Thử thanh toán lại
          </button>
        )}
        <Link to="/cart" className={styles.secondary}>
          Về giỏ hàng
        </Link>
      </div>
    </section>
  );
}
