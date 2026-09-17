import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../../features/cart/useCart";
import { findProduct } from "../../features/catalog/catalog";
import { formatPrice } from "../../types/product";
import CartItem from "./components/CartItem/CartItem";
import styles from "./Cart.module.css";
export default function Cart() {
  const { lines, itemCount, total } = useCart();
  return (
    <main id="main-content" className={styles.page}>
      <Link to="/#products" className={styles.back}>
        <ArrowLeft size={16} />
        Tiếp tục khám phá
      </Link>
      <div className={styles.heading}>
        <span>LỰA CHỌN CỦA BẠN</span>
        <h1>
          Giỏ hàng <span>{itemCount}</span>
        </h1>
        <p>Kiểm tra sản phẩm và cấu hình trước khi tiếp tục.</p>
      </div>
      {lines.length === 0 ? (
        <section className={styles.empty}>
          <span className={styles.emptyIcon}>
            <ShoppingBag size={42} strokeWidth={1.3} />
          </span>
          <h2>Giỏ hàng đang chờ bạn</h2>
          <p>
            Khám phá những thiết bị yêu thích và thêm lựa chọn đầu tiên vào giỏ.
          </p>
          <Link to="/#products">
            Khám phá sản phẩm <ArrowRight size={17} />
          </Link>
        </section>
      ) : (
        <div className={styles.layout}>
          <section className={styles.items} aria-label="Sản phẩm trong giỏ">
            <div className={styles.listHeading}>
              <h2>Sản phẩm đã chọn</h2>
              <span>{lines.length} cấu hình</span>
            </div>
            {lines.map((line) => {
              const product = findProduct(line.productId);
              return product ? (
                <CartItem
                  key={line.productId}
                  product={product}
                  quantity={line.quantity}
                />
              ) : null;
            })}
          </section>
          <aside className={styles.summary} aria-labelledby="summary-title">
            <h2 id="summary-title">Tóm tắt giỏ hàng</h2>
            <dl>
              <div>
                <dt>Số lượng sản phẩm</dt>
                <dd>{itemCount}</dd>
              </div>
              <div>
                <dt>Số cấu hình</dt>
                <dd>{lines.length}</dd>
              </div>
            </dl>
            <div className={styles.total}>
              <span>Tổng tiền sản phẩm</span>
              <strong aria-live="polite">{formatPrice(total)}</strong>
            </div>
            <Link to="/checkout">
              Tiến hành thanh toán <ArrowRight size={16} />
            </Link>
            <Link to="/#products" className={styles.continueShopping}>
              Tiếp tục mua sắm
            </Link>
            <p>
              Giỏ hàng dùng thử được giữ trong tab hiện tại và sẽ làm mới khi
              tải lại trang.
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}
