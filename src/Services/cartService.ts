import { cartModel } from "../Models/cartModel";

interface CreateCartForUser {
  userId: string;
}

const createCartForUser = async ({ userId }: CreateCartForUser) => {
  const cart = await cartModel.create({ userId , totalAmount:0});
  await cart.save();
  return cart;
};

interface GetCartActiveForUser {
  userId: string;
}

export const getActiveCartForUser = async ({userId,}: GetCartActiveForUser) => {
  let cart = await cartModel.findOne({ userId, status: "active" });

  if (!cart) {
    cart = await createCartForUser({ userId });
  }

  return cart;
};
