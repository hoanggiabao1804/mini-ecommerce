import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowUpRight, Search, ShoppingCart, LayoutGrid } from "lucide-react";
import { categories } from "../../../config/categories";
import { useCart } from "../../../features/cart/useCart";
import NotificationMenu from "../NotificationMenu/NotificationMenu";
import AccountMenu from "../AccountMenu/AccountMenu";
import styles from "./Header.module.css";

function SearchForm({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate({
      pathname: "/",
      search: query.trim()
        ? `?${new URLSearchParams({ q: query.trim() })}`
        : "",
      hash: "#products",
    });
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <form role="search" className={styles.search} onSubmit={search}>
      <input
        aria-label="Tìm kiếm sản phẩm"
        type="search"
        placeholder="Bạn đang tìm thiết bị gì?"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button type="submit" aria-label="Tìm kiếm">
        <Search size={21} />
      </button>
    </form>
  );
}

export default function Header() {
  const [params] = useSearchParams();
  const { itemCount } = useCart();
  const selected = params.get("category");
  return (
    <header className={styles.header}>
      <div className={styles.announcement}>
        <span>Công nghệ bạn yêu. Lựa chọn bạn muốn.</span>
        <Link to="/#products">
          Khám phá ngay <ArrowUpRight size={14} />
        </Link>
      </div>
      <div className={styles.main}>
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0 })}
          className={styles.logo}
          aria-label="Mini Ecommerce - Trang chủ"
        >
          <img src="/logo.png" alt="" />
          <span>
            mini<span className={styles.logoSuffix}>ecommerce</span>
          </span>
        </Link>
        <SearchForm
          key={params.get("q") ?? ""}
          initialQuery={params.get("q") ?? ""}
        />
        <div className={styles.actions}>
          <AccountMenu />
          <NotificationMenu />
          <Link
            to="/cart"
            className={styles.cartLink}
            aria-label={`Giỏ hàng, ${itemCount} sản phẩm`}
          >
            <ShoppingCart size={22} />
            <span>Giỏ hàng</span>
            {itemCount > 0 && (
              <strong className={styles.cartCount}>
                {itemCount > 99 ? "99+" : itemCount}
              </strong>
            )}
          </Link>
        </div>
      </div>
      <nav className={styles.navigation} aria-label="Danh mục sản phẩm">
        <div className={styles.navInner}>
          <Link
            to="/#products"
            className={!selected ? styles.active : undefined}
          >
            <LayoutGrid size={18} />
            Tất cả sản phẩm
          </Link>
          {categories.map(({ id, label, icon: Icon }) => (
            <Link
              key={id}
              to={`/?category=${id}#products`}
              className={selected === id ? styles.active : undefined}
              aria-current={selected === id ? "page" : undefined}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
