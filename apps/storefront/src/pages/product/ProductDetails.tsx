import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, PackageSearch, ArrowLeft } from "lucide-react";
import { useCatalog } from "../../features/catalog/useCatalog";
import { getProduct } from "../../api/products";
import { apiMessage } from "../../api/client";
import type { Product } from "../../types/product";
import { categories } from "../../config/categories";
import ProductInfo from "./components/ProductInfo/ProductInfo";
import ProductDescription from "./components/ProductDescription/ProductDescription";
import ProductCard from "../../components/share/ProductCard/ProductCard";
import ProductImage from "../../components/share/ProductImage/ProductImage";
import styles from "./ProductDetails.module.css";
export default function ProductDetails() {
  const { productId } = useParams();
  const {findProduct,cacheProduct,products,loading:catalogLoading}=useCatalog();
  const cached=findProduct(productId ?? "");
  const [remote,setRemote]=useState<Product|null>(null);
  const [error,setError]=useState<{slug:string;message:string}|null>(null);
  const [selectedId,setSelectedId]=useState<number|null>(null);
  useEffect(()=>{if(!productId||cached)return;const controller=new AbortController();getProduct(productId,controller.signal).then(product=>{if(!controller.signal.aborted){setRemote(product);cacheProduct(product);}}).catch(error=>{if(!controller.signal.aborted)setError({slug:productId,message:apiMessage(error)});});return()=>controller.abort();},[productId,cached,cacheProduct]);
  const product=cached ?? (remote?.slug===productId?remote:null);
  if(catalogLoading || (!cached && remote?.slug!==productId && error?.slug!==productId))return <main id="main-content" className={styles.page}><p role="status">Đang tải sản phẩm…</p></main>;
  if(error && error.slug===productId)return <main id="main-content" className={styles.page}><p role="alert">{error.message}</p><Link to="/#products">Về danh sách sản phẩm</Link></main>;
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
  const related=products.filter(item=>item.category===product.category&&item.id!==product.id).slice(0,4);
  const selected=product.variants.find(v=>v.id===selectedId)??product.variants[0];
  if(!selected)return <main id="main-content" className={styles.notFound}><h1>Sản phẩm chưa có phiên bản đang bán</h1><Link to="/#products">Về danh sách sản phẩm</Link></main>;
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
              key={selected?.id ?? product.id}
              src={selected?.image ?? ""}
              alt={product.name}
              eager
            />
          </div>
          <div className={styles.caption}>
            <span>{product.brand}</span>
            <span>Thiết kế trong từng chi tiết</span>
          </div>
        </section>
        <ProductInfo key={product.id} product={product} selected={selected} onSelect={setSelectedId} />
      </div>
      <ProductDescription product={product} selected={selected} />
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
