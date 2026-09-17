import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { categories } from "../../../config/categories";
import styles from "./Footer.module.css";
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link to="/">
            <img src="/logo.png" alt="" />
            <strong>mini ecommerce</strong>
          </Link>
          <p>
            Một nơi cho những thiết bị bạn yêu thích.
            <br />
            Khám phá công nghệ theo cách của bạn.
          </p>
        </div>
        <div>
          <h2>Khám phá sản phẩm</h2>
          <div className={styles.links}>
            {categories.map((category) => (
              <Link key={category.id} to={`/?category=${category.id}#products`}>
                {category.label}
              </Link>
            ))}
          </div>
        </div>
        <div className={styles.note}>
          <span>CHỌN ĐIỀU BẠN THÍCH</span>
          <h2>
            Công nghệ nhỏ.
            <br />
            Trải nghiệm lớn.
          </h2>
          <Link to="/#products">
            Bắt đầu khám phá <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Mini Ecommerce</span>
        <span>Được tạo nên từ niềm yêu thích công nghệ.</span>
      </div>
    </footer>
  );
}
