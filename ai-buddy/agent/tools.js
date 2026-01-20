const { tool } = require("@langchain/core/tools");
const axios = require("axios");
const { z } = require("zod");

const searchProduct = tool(
  async ({ query, token }) => {
    // Token is passed here by the Node.js caller, not the LLM
    try {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await axios.get(
        `https://cohort-final-project-product.onrender.com/api/products`,
        { params: { q: query }, headers },
      );

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
    description:
      "Search for products based on a query string (e.g., 'laptop', 'shoes').",
    schema: z.object({
      query: z.string().describe("The search term provided by the user"),
      // REMOVED token from here so the AI doesn't try to guess it
    }),
  },
);

const addProductToCart = tool(
  async ({ productId, qty = 1, token }) => {
    try {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await axios.post(
        `https://cohort-final-project-cart.onrender.com/api/cart/items`,
        { productId, qty },
        { headers },
      );

      return JSON.stringify({
        ok: true,
        data: response.data,
        message: `Successfully added product ${productId} with quantity ${qty}`,
      });
    } catch (err) {
      console.error(
        "addProductToCart error",
        err?.response?.data || err?.message,
      );
      const status = err?.response?.status;

      // If 401, the agent can now see this and tell the user to log in
      return JSON.stringify({
        ok: false,
        status,
        error:
          status === 401
            ? "User is not authenticated"
            : err?.response?.data || err?.message,
      });
    }
  },
  {
    name: "addProductToCart",
    description: "Adds a specific product ID to the user's shopping cart.",
    schema: z.object({
      productId: z.string().describe("The unique ID of the product"),
      qty: z.number().describe("How many items to add").default(1),
      // REMOVED token from here
    }),
  },
);

module.exports = { searchProduct, addProductToCart };
