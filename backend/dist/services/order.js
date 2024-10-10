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
exports.getLatestOrders = exports.getOrders = exports.createOrder = void 0;
const config_1 = require("../config");
const createOrder = (orderData) => __awaiter(void 0, void 0, void 0, function* () {
    const { clerkUserId, totalAmount, items, status, address } = orderData;
    if (!clerkUserId ||
        !totalAmount ||
        !items ||
        items.length === 0 ||
        !address) {
        throw new Error("Missing order data");
    }
    // Find the user by their Clerk ID
    const user = yield config_1.prisma.user.findUnique({
        where: { clerkUserId },
    });
    if (!user) {
        throw new Error("User not found");
    }
    // Create the order in the database
    const createdOrder = yield config_1.prisma.order.create({
        data: {
            userId: user.id,
            totalAmount,
            status,
            address,
        },
    });
    // Create order items linked to the order
    const orderItems = items.map((item) => ({
        quantity: item.quantity,
        price: item.price,
        orderId: createdOrder.id,
        productId: item.productId,
    }));
    // Bulk create order items
    yield config_1.prisma.orderItem.createMany({ data: orderItems });
    return createdOrder;
});
exports.createOrder = createOrder;
const getOrders = (clerkUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield config_1.prisma.user.findUnique({
        where: { clerkUserId },
    });
    if (!user) {
        throw new Error("User Not Found!");
    }
    const orders = yield config_1.prisma.order.findMany({
        where: { userId: user.id },
        include: { items: { include: { product: true } } },
    });
    return orders;
});
exports.getOrders = getOrders;
const getLatestOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield config_1.prisma.order.findMany({
        where: { status: "success" },
        orderBy: { createdAt: "desc" },
        include: { user: true, items: { include: { product: true } } },
    });
    return orders;
});
exports.getLatestOrders = getLatestOrders;
