import jwt from "jsonwebtoken";
import envConfig from "../config/index.js";

const generateToken = (payload: { id: number }) => {
  return jwt.sign(payload, envConfig.jwt.secret as string, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string) => {
  try {
    if (!token) return null;
    return jwt.verify(token, envConfig.jwt.secret as string);
  } catch (error: any) {
    console.log("JWT verification error: ", error);
    return null;
  }
};

export default generateToken;
