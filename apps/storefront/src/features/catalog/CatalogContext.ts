import { createContext } from "react";
import type { Product, ProductVariant } from "../../types/product";
export type CatalogState = {products:Product[];loading:boolean;error:string;reload:()=>void;findProduct:(slug:string)=>Product|undefined;findVariant:(id:number)=>{product:Product;variant:ProductVariant}|undefined;cacheProduct:(product:Product)=>void};
export const CatalogContext = createContext<CatalogState|null>(null);
