const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Validation error", errors });
  }
  next();
};

const productValidationRules = () => {
  return [
    body("title").isString().trim().notEmpty().withMessage("title is required"),
    body("description")
      .optional()
      .isString()
      .withMessage("description must be a string")
      .trim()
      .isLength({ max: 500 })
      .withMessage("description max length is 500 characters"),
    body("priceAmount")
      .notEmpty()
      .withMessage("priceAmount is required")
      .bail()
      .isFloat({ gt: 0 })
      .withMessage("priceAmount must be a number"),
    body("priceCurrency")
      .optional()
      .isIn(["USD", "INR"])
      .withMessage("priceCurrency must be USD or INR"),
    validate,
  ];
};

module.exports = {
  productValidationRules,
};
