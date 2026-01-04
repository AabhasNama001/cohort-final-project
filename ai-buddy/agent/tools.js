const { tool } = require("@langchain/core/tools");
const axios = require("axios");
const { z } = require("zod");

const searchProduct = tool(
  async ({ query, token }) => {
    try {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await axios.get(
        `https://cohort-final-project-product.onrender.com/api/products`,
        { params: { q: query }, headers }
      );

      // return structured JSON so the agent can parse it easily
      return JSON.stringify({ ok: true, data: response.data });
    } catch (err) {
      console.error("searchProduct error", err?.message || err);
      return JSON.stringify({
        ok: false,
        error: err?.response?.data || err?.message,
      });
    }
  },
  {
    name: "searchProduct",
    description: "Search for products based on query",
    schema: z.object({
      query: z.string().describe("The search query for products"),
      token: z
        .string()
        .optional()
        .describe("Optional bearer token for authenticated requests"),
    }),
  }
);

const addProductToCart = tool(
  async ({ productId, qty = 1, token }) => {
    try {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await axios.post(
        `https://cohort-final-project-cart.onrender.com/api/cart/items`,
        { productId, qty },
        { headers }
      );

      return JSON.stringify({
        ok: true,
        data: response.data,
        message: `Added product ${productId} (qty:${qty})`,
      });
    } catch (err) {
      console.error(
        "addProductToCart error",
        err?.response?.data || err?.message
      );
      const status = err?.response?.status;
      // return structured error so agent can decide next steps (e.g., ask user to login)
      return JSON.stringify({
        ok: false,
        status,
        error: err?.response?.data || err?.message,
      });
    }
  },
  {
    name: "addProductToCart",
    description: "Add a product to shopping cart",
    schema: z.object({
      productId: z
        .string()
        .describe("The id of the product to add to the cart"),
      qty: z
        .number()
        .describe("The quantity of the product to add to the cart")
        .default(1),
      token: z
        .string()
        .optional()
        .describe("Optional bearer token for authenticated requests"),
    }),
  }
);

module.exports = { searchProduct, addProductToCart };
