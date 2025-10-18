const express = require("express");
const multer = require("multer");
const productController = require("../controllers/product.controller");
const {
  productValidationRules,
} = require("../middlewares/validator.middleware");
const createAuthMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

/* POST /api/products */
router.post(
  "/",
  createAuthMiddleware(["admin", "seller"]),
  upload.array("images", 5),
  productValidationRules(),
  productController.createProduct
);

/* GET /api/products */
router.get("/", productController.getProducts);

/* PATCH /api/products/:id */
router.patch(
  "/:id",
  createAuthMiddleware(["seller"]),
  productController.updateProduct
);

/* DELETE /api/products/:id */
router.delete(
  "/:id",
  createAuthMiddleware(["seller"]),
  productController.deleteProduct
);

router.get(
  "/seller",
  createAuthMiddleware(["seller"]),
  productController.getProductsBySeller
);

/* GET /api/products/:id */
router.get("/:id", productController.getProductById);

module.exports = router;
