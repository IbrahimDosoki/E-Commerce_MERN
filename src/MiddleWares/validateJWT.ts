import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userModel from "../Models/userModel";
import { ExtendRequest } from "../types/extendedRequest";

const validateJWT = (req: ExtendRequest, res: Response, next: NextFunction) => {
  const authorizataionHeader = req.get("authorization");

  if (!authorizataionHeader) {
    res.status(403).send("Authorization Header was not Found!");
    return;
  }

  const token = authorizataionHeader.split(" ")[1];

  if (!token) {
    res.status(403).send("Bearer Token Not Founded!");
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET || "", async (err, payload) => {
    if (err) {
      res.status(403).send("Invalid Token!");
      return;
    }

    if (!payload) {
      res.status(403).send("Invalid token payload");
      return;
    }

    const userPayload = payload as {
      email: string;
      firstName: string;
      lastName: string;
    };

    // Fetch user from database based on the payload
    const user = await userModel.findOne({ email: userPayload.email });

    req.user = user;
    next();
  });
};

export default validateJWT;
