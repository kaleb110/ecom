import { body } from "express-validator";

export const addProductValidator = [
  body("name").trim().escape().notEmpty().withMessage("Name is required"),
  body("description")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Description is required"),
  body("price").trim().escape().notEmpty().withMessage("Price is required"),
  body("stock").trim().escape().notEmpty().withMessage("Stock is required"),
  body("imageUrl").trim().escape().notEmpty().withMessage("Image is required"),
  body("categories")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("categories is required"),
  body("categories").isArray().withMessage("categories must be an array"),
];