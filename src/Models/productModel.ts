import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  image: string;
  price: number;
  stock: number;
}

const productSchema = new Schema<IProduct>({
  title: { type: String, require: true },
  image: { type: String, require: true },
  price: { type: Number, require: true },
  stock: { type: Number, require: true, default: 0 },
});

const productModel = mongoose.model<IProduct>("Product", productSchema);

export default productModel;
