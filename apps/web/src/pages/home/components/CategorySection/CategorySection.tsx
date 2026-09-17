import { Link, useSearchParams } from "react-router-dom";
import { LayoutGrid, ArrowUpRight } from "lucide-react";
import { categories } from "../../../../config/categories";
import styles from "./CategorySection.module.css";
export default function CategorySection() {
  const [params] = useSearchParams();
  return (
    <section className={styles.section} aria-labelledby="category-title">
      <div className={styles.heading}>
        <h2 id="category-title">Bạn đang tìm gì?</h2>
        <span>Chọn thiết bị, tìm cảm hứng.</span>
      </div>
      <div className={styles.grid}>
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/?category=${category.id}#products`}
            className={
              params.get("category") === category.id ? styles.active : undefined
            }
          >
            <div className={styles.image}>
              <img src={category.image} alt="" loading="lazy" />
            </div>
            <span>{category.label}</span>
          </Link>
        ))}
        <Link to="/#products" className={styles.all}>
          <div className={styles.allIcon}>
            <LayoutGrid size={30} strokeWidth={1.4} />
          </div>
          <span>
            Tất cả sản phẩm <ArrowUpRight size={14} />
          </span>
        </Link>
      </div>
    </section>
  );
}
