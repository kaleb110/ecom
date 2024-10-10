"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.CLERK_API_KEY = exports.CLERK_SECRET_KEY = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
exports.PORT = process.env.PORT || 6000;
exports.CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
exports.CLERK_API_KEY = process.env.CLERK_API_KEY;
exports.prisma = new client_1.PrismaClient();
