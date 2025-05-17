import express from "express";
import mongoose from "mongoose";
import userRoute from "./Routes/userRoute";
import productRoute from "./Routes/productRoute";
import cartRoute from "./Routes/cartRoute"
import { seedInitialProducts } from "./Services/productService";

const app = express();
const port = 3003;

// Middel Wares
app.use(express.json());

// Connect to MongoDB by Mongoose
mongoose
  .connect("mongodb://localhost:27017/ecommerce")
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
app.use("/cart",cartRoute)

app.listen(port, () => {
  console.log("The Server is Start On ");
});
