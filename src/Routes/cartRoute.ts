import express, { Request } from "express";
import { getActiveCartForUser } from "../Services/cartService";
import validateJWT from "../MiddleWares/validateJWT";
import { ExtendRequest } from "../types/extendedRequest";
import { addItemToCart, updateItemCart } from "../Services/cartService";

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

export default router;
