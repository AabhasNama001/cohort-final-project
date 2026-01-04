const { tool } = require("@langchain/core/tools");
const axios = require("axios");
const { z } = require("zod");

// Standardize error handling to be reused across tools
const handleApiError = (toolName, err) => {
  console.error(`${toolName} error:`, err?.response?.data || err?.message);
  return JSON.stringify({
    ok: false,
    status: err?.response?.status,
    error: err?.response?.data || err?.message || "Unknown error occurred",
    
  });
};

/**
 * Search for products using semantic search capabilities.
 */
const searchProduct = tool(
  async ({ query, token }) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(
        `https://cohort-final-project-product.onrender.com/api/products`,
        { params: { q: query }, headers }
      );

      // 2026 Best Practice: Return a clear status and the raw data array
      return JSON.stringify({
        ok: true,
        count: response.data?.length || 0,
        products: response.data,
      });
    } catch (err) {
      return handleApiError("searchProduct", err);
    }
  },
  {
    name: "searchProduct",
    description:
      "Search for products by name, category, or description. Returns a list of matching product objects.",
    schema: z.object({
      query: z
        .string()
        .min(1)
        .describe("The keyword or product name to search for"),
      token: z
        .string()
        .optional()
        .describe("Auth token for personalized results"),
    }),
  }
);

/**
 * Add a specific product to the user's cart.
 */
const addProductToCart = tool(
  async ({ productId, qty = 1, token }) => {
    if (!token) {
      return JSON.stringify({
        ok: false,
        error: "Authentication required to add items to cart.",
      });
    }

    try {
      const response = await axios.post(
        `https://cohort-final-project-cart.onrender.com/api/cart/items`,
        { productId, qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return JSON.stringify({
        ok: true,
        message: `Successfully added ${qty} unit(s) of product ${productId} to your cart.`,
        cartItem: response.data, // Return the new item state for the frontend
      });
    } catch (err) {
      return handleApiError("addProductToCart", err);
    }
  },
  {
    name: "addProductToCart",
    description:
      "Adds a specific quantity of a product to the user's shopping cart. Requires a valid user token.",
    schema: z.object({
      productId: z.string().describe("The unique ID of the product"),
      qty: z
        .number()
        .int()
        .positive()
        .default(1)
        .describe("Number of items to add"),
      token: z
        .string()
        .describe("The user's bearer token (mandatory for this action)"),
    }),
  }
);

module.exports = { searchProduct, addProductToCart };
