import express from "express";
// import { PORT } from "./config/index";
import router from "./routes/route";
import dotenv from "dotenv";
import cors from "cors";
// import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { Application } from "express";
dotenv.config();
const app: Application = express();

//middleware
app.use(express.json());
app.use(cors());
app.use("/", router);
// app.use(
//   ClerkExpressWithAuth({
//     secretKey: process.env.CLERK_SECRET_KEY,
//   })
// );

app.listen(5000, () => {
  console.log(`server started on port:http://localhost:${5000}`);
});

export default app;
