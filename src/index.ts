import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import userRoute from "./Routes/userRoute";
import productRoute from "./Routes/productRoute";
import cartRoute from "./Routes/cartRoute";
import { seedInitialProducts } from "./Services/productService";

dotenv.config();

const app = express();
const port = 3005;

// Middel Wares
app.use(express.json());

// Connect to MongoDB by Mongoose
mongoose
  .connect(process.env.DATABASE_URL || "")
  .then(() => {
    console.log("Mongo Connected Successfully");
  })
  .catch((error) => {
    console.log("Failed to Connect", error);
  });

// Seed the products to DataBase
seedInitialProducts();

// Create a Routes
app.use("/user", userRoute);
app.use("/product", productRoute);
app.use("/cart", cartRoute);

app.listen(port, () => {
  console.log("The Server is Start On ");
});
