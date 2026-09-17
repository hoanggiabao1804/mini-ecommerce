import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { findProduct } from "../../../features/catalog/catalog";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./StoreLayout.module.css";
export default function StoreLayout() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
    const titles: Record<string, string> = {
      "/login": "Đăng nhập",
      "/register": "Đăng ký",
      "/profile": "Tài khoản của tôi",
      "/cart": "Giỏ hàng",
      "/checkout": "Thanh toán",
      "/notifications": "Thông báo",
    };
    const productId = location.pathname.startsWith("/products/")
      ? location.pathname.slice("/products/".length)
      : "";
    const product = findProduct(productId);
    document.title = `${productId ? (product?.name ?? "Không tìm thấy sản phẩm") : (titles[location.pathname] ?? "Công nghệ theo cách của bạn")} | Mini Ecommerce`;
  }, [location.pathname]);
  useEffect(() => {
    if (!location.hash) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView();
    });
    return () => cancelAnimationFrame(frame);
  }, [location.key, location.hash]);
  return (
    <div className={styles.layout}>
      <a className="skip-link" href="#main-content">
        Chuyển đến nội dung chính
      </a>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
