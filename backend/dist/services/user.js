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
exports.createUser = exports.getUser = void 0;
// Service: user.ts
const config_1 = require("../config");
// Fetch user by Clerk ID or Email
const getUser = (clerkUserId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield config_1.prisma.user.findUnique({ where: { clerkUserId } });
});
exports.getUser = getUser;
// Create or fetch user
// Service: user.ts
// Create or fetch user
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { clerkUserId, email, name } = user;
    try {
        // Check if the user already exists by Clerk ID or Email
        const existingUser = yield config_1.prisma.user.findFirst({
            where: {
                OR: [
                    { clerkUserId: clerkUserId },
                    { email: email },
                ],
            },
        });
        if (existingUser) {
            return existingUser; // User already exists, return it
        }
        // Create a new user in the database if not exists
        return yield config_1.prisma.user.create({
            data: {
                clerkUserId,
                email,
                name: name || "John Doe", // Default name if none provided
            },
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Unable to create user."); // Throw an error to handle in controller
    }
});
exports.createUser = createUser;
