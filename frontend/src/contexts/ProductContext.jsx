import React, { createContext, useEffect, useState } from "react";
import * as productService from "../services/product.service";

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadProducts = async (params) => {
    setLoading(true);
    try {
      // 'res' is an OBJECT from your service, e.g., { message: "...", data: [...] }
      const res = await productService.fetchProducts(params);

      // THE FIX: Access the 'data' property from the response object.
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to load products:", err);
      setProducts([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, loadProducts }}>
      {children}
    </ProductContext.Provider>
  );
}
