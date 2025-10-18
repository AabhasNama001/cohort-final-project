import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // route-by-path to each microservice port
      "^/api/auth": {
        target: "https://cohort-final-project-auth.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/auth/, "/api/auth"),
      },
      "^/api/products": {
        target: "https://cohort-final-project-product.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/products/, "/api/products"),
      },
      "^/api/cart": {
        target: "https://cohort-final-project-cart.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cart/, "/api/cart"),
      },
      "^/api/orders": {
        target: "https://cohort-final-project-orders.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/orders/, "/api/orders"),
      },
      "^/api/payment": {
        target: "https://cohort-final-project-payment.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/payment/, "/api/payment"),
      },
      "^/api/ai-buddy": {
        target: "https://cohort-final-project-ai-buddy.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai-buddy/, "/api/ai-buddy"),
      },
      "^/api/notifications": {
        target: "https://cohort-final-project-notification.onrender.com",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/api\/notifications/, "/api/notifications"),
      },
      "^/api/seller": {
        target: "https://cohort-final-project-seller.onrender.com/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/seller/, "/api/seller"),
      },
    },
  },
});
