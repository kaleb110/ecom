"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductController = exports.addProductController = exports.getProductsController = exports.getSingleProductController = void 0;
// products
const product_1 = require("../services/product");
const getSingleProductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield (0, product_1.getSingleProduct)(Number(id));
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    }
    catch (error) {
        console.error("Error happened:", error);
        res.status(500).json({ message: "No Product Found!" });
    }
});
exports.getSingleProductController = getSingleProductController;
const getProductsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, product_1.getProducts)();
        if (!products) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(products);
    }
    catch (error) {
        console.error("Error happened:", error);
        res.status(500).json({ message: "No Product Found!" });
    }
});
exports.getProductsController = getProductsController;
const addProductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = Object.assign({}, req.body);
        // Decode the image URL if necessary
        const decodedImageUrl = product.imageUrl.replace(/&#x2F;/g, "/");
        // Continue with the rest of your logic
        yield (0, product_1.addProduct)(Object.assign(Object.assign({}, product), { imageUrl: decodedImageUrl }));
        res.status(201).json({ message: "Product added successfully!" });
    }
    catch (error) {
        console.error("Error in adding product:", error);
        res.status(500).json({ message: "Cannot add product!" });
    }
});
exports.addProductController = addProductController;
const deleteProductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield (0, product_1.deleteProduct)(Number(id));
        res.status(200).json({ message: "Product Deleted Successfuly !" });
    }
    catch (error) {
        console.error("Error Can Not Delete Product !", error);
        res.status(500).json({ message: "Can Not Delete Product !" });
    }
});
exports.deleteProductController = deleteProductController;
