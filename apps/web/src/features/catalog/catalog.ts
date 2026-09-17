import { products } from "../../pages/home/data/products";
import type { Product } from "../../types/product";
export { products };
export const findProduct = (id: string) =>
  products.find((product) => product.id === id);
export const productPath = (id: string) =>
  `/products/${encodeURIComponent(id)}`;
export function getVariants(product: Product) {
  return product.variantGroup
    ? products.filter((item) => item.variantGroup === product.variantGroup)
    : [product];
}
export function getRelatedProducts(product: Product) {
  return products
    .filter(
      (item) =>
        item.category === product.category &&
        item.id !== product.id &&
        (!product.variantGroup || item.variantGroup !== product.variantGroup),
    )
    .slice(0, 4);
}
