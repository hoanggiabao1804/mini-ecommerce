import { useEffect, useState, type ReactNode } from "react";
import { CatalogContext } from "./CatalogContext";
import { listProducts } from "../../api/products";
import { apiMessage } from "../../api/client";
import type { Product } from "../../types/product";
export default function CatalogProvider({children}:{children:ReactNode}) {
 const [products,setProducts]=useState<Product[]>([]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 const [revision,setRevision]=useState(0);
 useEffect(()=>{
  const controller=new AbortController();
  async function load(){
   setLoading(true);setError("");
   try {
    const first=await listProducts(1,controller.signal);
    const pages=await Promise.all(Array.from({length:Math.max(0,first.meta.totalPages-1)},(_,index)=>listProducts(index+2,controller.signal)));
    if(!controller.signal.aborted) setProducts([first,...pages].flatMap(page=>page.data));
   }catch(error){if(!controller.signal.aborted)setError(apiMessage(error));}
   finally{if(!controller.signal.aborted)setLoading(false);}
  }
  void load();return ()=>controller.abort();
 },[revision]);
 const value={products,loading,error,reload:()=>setRevision(n=>n+1),findProduct:(slug:string)=>products.find(p=>p.slug===slug),findVariant:(id:number)=>{for(const product of products){const variant=product.variants.find(v=>v.id===id);if(variant)return {product,variant};}return undefined;},cacheProduct:(product:Product)=>setProducts(current=>current.some(p=>p.id===product.id)?current.map(p=>p.id===product.id?product:p):[...current,product])};
 return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}
