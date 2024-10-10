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
exports.paymentController = void 0;
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.SECRET_KEY, {
    apiVersion: "2024-06-20",
});
const paymentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartItems, address } = req.body; // Expecting cartItems and address from frontend
    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ error: "No cart items provided" });
    }
    try {
        let totalAmount = 0; // Initialize totalAmount
        const line_items = cartItems.map((item) => {
            const priceInCents = Math.round(item.product.price * 100); // Convert price to cents
            if (typeof priceInCents !== "number" || isNaN(priceInCents)) {
                throw new Error(`Invalid price for item: ${JSON.stringify(item)}`);
            }
            if (typeof item.quantity !== "number" || isNaN(item.quantity)) {
                throw new Error(`Invalid quantity for item: ${JSON.stringify(item)}`);
            }
            totalAmount += priceInCents * item.quantity; // Calculate total amount
            return {
                price_data: {
                    currency: "usd", // Change this as per your requirement
                    product_data: {
                        name: item.product.name, // Product name from cart
                    },
                    unit_amount: priceInCents, // Stripe expects amount in cents
                },
                quantity: item.quantity,
            };
        });
        // Create the checkout session
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items,
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`, // Pass session_id to success page
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
            shipping_address_collection: {
                allowed_countries: ["US", "CA"],
            },
        });
        // Return session URL and total amount
        res.json({ url: session.url, totalAmount });
    }
    catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.paymentController = paymentController;
