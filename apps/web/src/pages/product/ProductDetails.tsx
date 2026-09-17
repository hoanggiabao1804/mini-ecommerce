import { Link, useParams } from "react-router-dom";
import { ChevronRight, PackageSearch, ArrowLeft } from "lucide-react";
import {
  findProduct,
  getRelatedProducts,
} from "../../features/catalog/catalog";
import { categories } from "../../config/categories";
import ProductInfo from "./components/ProductInfo/ProductInfo";
import ProductDescription from "./components/ProductDescription/ProductDescription";
import ProductCard from "../../components/share/ProductCard/ProductCard";
import ProductImage from "../../components/share/ProductImage/ProductImage";
import styles from "./ProductDetails.module.css";
export default function ProductDetails() {
  const { productId } = useParams();
  const product = findProduct(productId ?? "");
  if (!product)
    return (
      <main id="main-content" className={styles.notFound}>
        <PackageSearch size={54} strokeWidth={1.2} />
        <h1>Không tìm thấy sản phẩm</h1>
        <p>
          Sản phẩm này chưa có trong danh mục hoặc đường dẫn không còn đúng.
        </p>
        <Link to="/#products">
          <ArrowLeft size={17} />
          Về danh sách sản phẩm
        </Link>
      </main>
    );
  const category = categories.find((item) => item.id === product.category);
  const related = getRelatedProducts(product);
  return (
    <main id="main-content" className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Đường dẫn">
        <Link to="/">Trang chủ</Link>
        <ChevronRight size={13} />
        <Link to={`/?category=${product.category}#products`}>
          {category?.label}
        </Link>
        <ChevronRight size={13} />
        <span aria-current="page">{product.name}</span>
      </nav>
      <div className={styles.hero}>
        <section
          className={styles.gallery}
          aria-label={`Hình ảnh ${product.name}`}
        >
          <div className={styles.image}>
            {product.badge && (
              <span className={styles.badge}>{product.badge}</span>
            )}
            <ProductImage
              key={product.id}
              src={product.image}
              alt={product.name}
              eager
            />
          </div>
          <div className={styles.caption}>
            <span>{product.brand}</span>
            <span>Thiết kế trong từng chi tiết</span>
          </div>
        </section>
        <ProductInfo key={product.id} product={product} />
      </div>
      <ProductDescription product={product} />
      {related.length > 0 && (
        <section className={styles.related} aria-labelledby="related-title">
          <div className={styles.sectionTitle}>
            <div>
              <span>CÓ THỂ BẠN CŨNG THÍCH</span>
              <h2 id="related-title">Khám phá thêm</h2>
            </div>
            <Link to={`/?category=${product.category}#products`}>
              Xem danh mục <ChevronRight size={15} />
            </Link>
          </div>
          <div className={styles.grid}>
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
