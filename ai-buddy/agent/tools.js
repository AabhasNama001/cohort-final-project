const { tool } = require("@langchain/core/tools");
const axios = require("axios");
const { z } = require("zod");

// Helper for consistent error reporting
const handleApiError = (toolName, err) => {
  console.error(`${toolName} error:`, err?.response?.data || err?.message);
  return JSON.stringify({
    ok: false,
    error: err?.response?.data || err?.message || "Internal Tool Error",
  });
};

const searchProduct = tool(
  async ({ query, token }) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(
        `https://cohort-final-project-product.onrender.com/api/products`,
        { params: { q: query }, headers }
      );
      return JSON.stringify({ ok: true, products: response.data });
    } catch (err) {
      return handleApiError("searchProduct", err);
    }
  },
  {
    name: "searchProduct",
    description: "Search for products. Returns an array of product objects.",
    schema: z.object({
      query: z.string().min(1).describe("Search keyword"),
      token: z.string().optional().describe("User auth token"),
    }),
  }
);

const addProductToCart = tool(
  async ({ productId, qty = 1, token }) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.post(
        `https://cohort-final-project-cart.onrender.com/api/cart/items`,
        { productId, qty },
        { headers }
      );
      return JSON.stringify({
        ok: true,
        message: `Added ${qty} items`,
        data: response.data,
      });
    } catch (err) {
      return handleApiError("addProductToCart", err);
    }
  },
  {
    name: "addProductToCart",
    description: "Adds a product to the cart. Requires productId and token.",
    schema: z.object({
      productId: z.string().describe("The ID of the product"),
      // FIX: Using .min(1) instead of .positive() to avoid 'exclusiveMinimum' error
      qty: z.number().int().min(1).default(1).describe("Quantity to add"),
      token: z
        .string()
        .describe("User auth token is required for cart actions"),
    }),
  }
);

module.exports = { searchProduct, addProductToCart };
