import Hero from "./components/Hero/Hero";
import CategorySection from "./components/CategorySection/CategorySection";
import ProductSection from "./components/ProductSection/ProductSection";
import styles from "./Home.module.css";
export default function Home() {
  return (
    <main id="main-content" className={styles.home}>
      <Hero />
      <CategorySection />
      <ProductSection />
    </main>
  );
}
