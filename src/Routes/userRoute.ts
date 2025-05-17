import express from "express";
import { login, register } from "../Services/userService";

const router = express.Router();

router.post("/rigister", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const { statusCode, data } = await register({
      firstName,
      lastName,
      email,
      password,
    });

    res.status(statusCode).send(data);
  } catch (e) {
    res.status(500).send("Somthing went wrong !");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { statusCode, data } = await login({ email, password });

    res.status(statusCode).send(data);
  } catch (e) {
    res.status(500).send("Somthing went wrong !");
  }
});

export default router;
