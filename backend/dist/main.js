"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("./config/index");
const route_1 = __importDefault(require("./routes/route"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
//middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/", route_1.default);
// app.use(
//   ClerkExpressWithAuth({
//     secretKey: process.env.CLERK_SECRET_KEY,
//   })
// );
app.listen(index_1.PORT, () => {
    console.log(`server started on port:http://localhost:${index_1.PORT}`);
});
exports.default = app;
