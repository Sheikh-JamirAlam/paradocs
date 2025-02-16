import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import documentRoutes from "./routes/documentRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/documents", documentRoutes);

export default app;
