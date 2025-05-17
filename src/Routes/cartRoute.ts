import express, { Request } from "express";
import { getActiveCartForUser } from "../Services/cartService";
import validateJWT from "../MiddleWares/validateJWT";
import { ExtendRequest } from "../types/extendedRequest";
import {
  addItemToCart,
  updateItemCart,
  deleteItemInCart,
  clearCart
} from "../Services/cartService";

const router = express.Router();

router.get("/", validateJWT, async (req: ExtendRequest, res) => {
  const userId = req.user._id;
  const cart = await getActiveCartForUser({ userId });
  res.status(200).send(cart);
});

// Add new item
router.post("/items", validateJWT, async (req: ExtendRequest, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;
  const response = await addItemToCart({ userId, productId, quantity });
  res.status(response.statusCode).send(response.data);
});

// Update Item in Cart
router.put("/items", validateJWT, async (req: ExtendRequest, res) => {
  const userId = req?.user?._id;

  const { productId, quantity } = req.body;
  const response = await updateItemCart({ userId, productId, quantity });
  res.status(response.statusCode).send(response.data);
});

// Delete Item from the Cart
router.delete(
  "/items/:productId",
  validateJWT,
  async (req: ExtendRequest, res) => {
    const userId = req?.user?._id;
    const { productId } = req.params;
    const response = await deleteItemInCart({ userId, productId });
    res.status(response.statusCode).send(response.data);
  }
);

// Cleart All Item in Cart
router.delete("/", validateJWT, async (req: ExtendRequest, res) => {
  const userId = req?.user?._id;
  const response = await clearCart({ userId });
  res.status(response.statusCode).send(response.data);
});

export default router;
