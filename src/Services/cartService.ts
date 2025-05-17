import { cartModel, ICart, ICartItem } from "../Models/cartModel";
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

// Clear Function for All Items
interface ClearCart {
  userId: string;
}

export const clearCart = async ({ userId }: ClearCart) => {
  const cart = await getActiveCartForUser({ userId });

  cart.items = [];
  cart.totalAmount = 0;

  const updatedCart = await cart.save();

  return { data: updatedCart, statusCode: 200 };
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
  const existingIcCart = cart.items.find(
    (p) => p.product.toString() === productId
  );

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

interface UpdateItemInCart {
  productId: any;
  userId: string;
  quantity: number;
}

export const updateItemCart = async ({
  productId,
  quantity,
  userId,
}: UpdateItemInCart) => {
  const cart = await getActiveCartForUser({ userId });

  // Existing in Cart
  const existingIcCart = cart.items.find(
    (p) => p.product.toString() === productId
  );

  if (!existingIcCart) {
    return { data: "Item does't exist in Cart", statusCode: 400 };
  }

  // Fetch the product
  const product = await productModel.findById(productId);

  if (!product) {
    return { data: "Product Not Found!", statusCode: 400 };
  }

  // Check the number of Stock
  if (product.stock < quantity) {
    return { data: "low stock for items", statusCode: 400 };
  }

  const otherCartItem = cart.items.filter(
    (p) => p.product.toString() !== productId
  );

  let total = calculateCartTotalItems({ cartItems: otherCartItem });

  existingIcCart.quantity = quantity;
  total += existingIcCart.quantity * existingIcCart.unitPrice;

  cart.totalAmount = total;

  const updatedCart = await cart.save();

  return { data: updatedCart, statusCode: 200 };

  // Calculate for the Total Amount for the Cart
};

// Create Delete Function

interface DeleteItemInCart {
  productId: any;
  userId: string;
}
export const deleteItemInCart = async ({
  userId,
  productId,
}: DeleteItemInCart) => {
  const cart = await getActiveCartForUser({ userId });
  const existingIcCart = cart.items.find(
    (p) => p.product.toString() === productId
  );

  if (!existingIcCart) {
    return { data: "Item does't exist in Cart", statusCode: 400 };
  }

  const otherCartItem = cart.items.filter(
    (p) => p.product.toString() !== productId
  );

  const total = calculateCartTotalItems({ cartItems: otherCartItem });

  cart.items = otherCartItem;

  cart.totalAmount = total;

  const updatedCart = await cart.save();

  return { data: updatedCart, statusCode: 200 };
};

const calculateCartTotalItems = ({ cartItems }: { cartItems: ICartItem[] }) => {
  const total = cartItems.reduce((sum, product) => {
    sum += product.quantity * product.unitPrice;
    return sum;
  }, 0);

  return total;
};
