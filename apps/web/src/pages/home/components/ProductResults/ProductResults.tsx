import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ProductCard from "../../../../components/share/ProductCard/ProductCard";
import type { Product } from "../../../../types/product";
import styles from "./ProductResults.module.css";
const PAGE_SIZE = 8;
export default function ProductResults({ products }: { products: Product[] }) {
  const [limit, setLimit] = useState(PAGE_SIZE);
  const visible = products.slice(0, limit);
  const remaining = products.length - visible.length;
  return (
    <>
      <div id="product-results" className={styles.grid}>
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className={styles.pagination}>
        <p role="status" aria-live="polite" aria-atomic="true">
          Đang hiển thị {visible.length} / {products.length} sản phẩm
        </p>
        {products.length > PAGE_SIZE && (
          <button
            type="button"
            aria-controls="product-results"
            disabled={!remaining}
            onClick={() =>
              setLimit((current) =>
                Math.min(current + PAGE_SIZE, products.length),
              )
            }
          >
            {remaining ? (
              <>
                Xem thêm {Math.min(PAGE_SIZE, remaining)} sản phẩm{" "}
                <ChevronDown size={17} />
              </>
            ) : (
              "Đã hiển thị tất cả sản phẩm"
            )}
          </button>
        )}
      </div>
    </>
  );
}
