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
exports.deleteProduct = exports.addProduct = exports.getSingleProduct = exports.getProducts = void 0;
const config_1 = require("../config");
const getProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield config_1.prisma.product.findMany({
        include: {
            categories: true,
        },
    });
});
exports.getProducts = getProducts;
const getSingleProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield config_1.prisma.product.findUnique({
        where: { id: productId },
        include: {
            categories: true,
        },
    });
});
exports.getSingleProduct = getSingleProduct;
// export const searchProducts = async (search, category) => {
//   return await prisma.product.findMany({
//     where: {
//       AND: [
//         {
//           name: {
//             contains: search,
//             mode: "insensitive",
//           },
//         },
//         {
//           categoryId: category ? parseInt(category) : undefined,
//         },
//       ],
//     },
//   });
// };
const addProduct = (product) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, stock, imageUrl, categories } = product;
    return yield config_1.prisma.product.create({
        data: {
            name,
            description,
            price: Number(price),
            stock: Number(stock),
            imageUrl: decodeURIComponent(imageUrl), // Store the image URL
            categories: {
                connect: categories.map((categoryId) => ({ id: Number(categoryId) })),
            },
        },
    });
});
exports.addProduct = addProduct;
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield config_1.prisma.product.delete({
        where: {
            id: id,
        },
    });
});
exports.deleteProduct = deleteProduct;
