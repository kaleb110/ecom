"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProductValidator = void 0;
const express_validator_1 = require("express-validator");
exports.addProductValidator = [
    (0, express_validator_1.body)("name").trim().escape().notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("description")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Description is required"),
    (0, express_validator_1.body)("price").trim().escape().notEmpty().withMessage("Price is required"),
    (0, express_validator_1.body)("stock").trim().escape().notEmpty().withMessage("Stock is required"),
    (0, express_validator_1.body)("imageUrl").trim().escape().notEmpty().withMessage("Image is required"),
    (0, express_validator_1.body)("categories")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("categories is required"),
    (0, express_validator_1.body)("categories").isArray().withMessage("categories must be an array"),
];
