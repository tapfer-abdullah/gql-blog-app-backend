import jwt from "jsonwebtoken";
import envConfig from "../config/index.js";

const generateToken = (payload: { id: number }) => {
  jwt.sign(payload, envConfig.jwt.secret as string, {
    expiresIn: "7d",
  });
};

export default generateToken;
