import { cartModel } from "../Models/cartModel";
import productModel from "../Models/productModel";

interface CreateCartForUser {
  userId: string;
}

const createCartForUser = async ({ userId }: CreateCartForUser) => {
  const cart = await cartModel.create({ userId, totalAmount: 0 });
  await cart.save();
  return cart;
};

interface GetCartActiveForUser {
  userId: string;
}

export const getActiveCartForUser = async ({
  userId,
}: GetCartActiveForUser) => {
  let cart = await cartModel.findOne({ userId, status: "active" });

  if (!cart) {
    cart = await createCartForUser({ userId });
  }

  return cart;
};

interface AddItemToCart {
  productId: any;
  userId: string;
  quantity: number;
}

export const addItemToCart = async ({
  productId,
  quantity,
  userId,
}: AddItemToCart) => {
  const cart = await getActiveCartForUser({ userId });

  // does the item exist in the cart ?
  const existingIcCart = cart.items.find((p) => p.product.toString() === productId);

  if (existingIcCart) {
    return { data: "Item Already Existed In Cart!", statusCode: 400 };
  }

  // Fetch the product
  const product = await productModel.findById(productId);

  if (!product) {
    return { data: "Product Not Found!", statusCode: 400 };
  }

  cart.items.push({
    product: productId,
    unitPrice: product.price,
    quantity,
  });

  // Check the number of Stock
  if (product.stock < quantity) {
    return { data: "low stock for items", statusCode: 400 };
  }

  // update the total Amount for the Cart
  cart.totalAmount += product.price * quantity;

  const updatedCart = await cart.save();

  return { data: updatedCart, statusCode: 200 };
};
