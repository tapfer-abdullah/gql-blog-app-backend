import path, { join } from "path";
import dotenv from "dotenv";
dotenv.config({ path: join(process.cwd(), ".env") });

const envConfig = {
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};

export default envConfig;
