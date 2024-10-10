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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestOrdersController = exports.getOrdersByUserController = exports.createOrderController = void 0;
const order_1 = require("../services/order");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.SECRET_KEY, {
    apiVersion: "2024-06-20",
});
const createOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { clerkUserId, status, totalAmount, items, sessionId } = req.body; // Receive sessionId and items from the frontend
        if (!sessionId) {
            return res.status(400).json({ error: "Session ID is required" });
        }
        // Retrieve the Stripe session using the sessionId
        const session = yield stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["shipping_details"], // Include shipping details
        });
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }
        // Check if shipping details are present in the session
        const shipping = session.shipping_details;
        if (!shipping || !shipping.address) {
            return res
                .status(400)
                .json({ error: "No shipping address found in session" });
        }
        // Create order data from the session
        const orderData = {
            clerkUserId: clerkUserId, // Assuming user ID is set in client_reference_id
            totalAmount: totalAmount, // Total amount in cents
            status: status,
            address: `${shipping.address.line1}, ${shipping.address.city}, ${shipping.address.country}`, // Construct address string
            items, // Pass the items from the frontend
        };
        // Call the service to create the order
        const createdOrder = yield (0, order_1.createOrder)(orderData);
        res.status(201).json(createdOrder); // Return the created order data
    }
    catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: error.message || "Failed to create order" });
    }
});
exports.createOrderController = createOrderController;
const getOrdersByUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { clerkUserId } = req.params;
        if (!clerkUserId) {
            return res.status(400).json({ error: "Missing userId" });
        }
        const orders = yield (0, order_1.getOrders)(clerkUserId);
        res.status(200).json(orders);
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: error.message || "Failed to fetch orders" });
    }
});
exports.getOrdersByUserController = getOrdersByUserController;
const getLatestOrdersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield (0, order_1.getLatestOrders)();
        res.status(200).json(orders);
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: error.message || "Failed to fetch orders" });
    }
});
exports.getLatestOrdersController = getLatestOrdersController;
