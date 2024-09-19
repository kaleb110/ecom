import express from "express";
import { PORT } from "./config/index.js";
import router from "./routes/route.js";
import dotenv from "dotenv";
import cors from "cors"

dotenv.config();
const app = express();
//middleware
app.use(express.json());
app.use(cors());
app.use("/", router);

app.listen(PORT, () => {
  console.log(`server started on port:http://localhost:${PORT}`);
});

export default app;
