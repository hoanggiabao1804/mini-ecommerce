import { useContext } from "react";
import { CatalogContext } from "./CatalogContext";
export function useCatalog(){const value=useContext(CatalogContext);if(!value)throw new Error("CatalogProvider missing");return value;}
