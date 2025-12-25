import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateToken from "../utils/jwtHelper.js";

interface ISignUpPayload {
  name: string;
  email: string;
  password: string;
  bio?: string;
}

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const resolvers = {
  Query: {
    users: async () => {
      return await prisma.user.findMany();
    },
    user: (parent: any, args: any, context: any) => {
      return prisma.user.findUnique({ where: { id: args.id } });
    },

    profiles: async () => {
      return await prisma.profile.findMany();
    },
    profile: async (parent: any, args: any, context: any) => {
      return prisma.profile.findUnique({ where: { id: args.id } });
    },

    posts: () => books,
    post: () => books[0],
  },

  Profile: {
    user: async (parent: any, args: any, context: any) => {
      return prisma.user.findUnique({ where: { id: parent.userId } });
    },
  },
  User: {
    profile: async (parent: any, args: any, context: any) => {
      return prisma.profile.findUnique({ where: { userId: parent.id } });
    },
  },

  Mutation: {
    signup: async (parent: any, args: ISignUpPayload, context: any) => {
      const isUserAlreadyExist = await prisma.user.findUnique({
        where: {
          email: args.email,
        },
      });

      if (isUserAlreadyExist) {
        return { success: false, token: null, message: "User already exist!" };
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(args.password, salt);

      const newUser = await prisma.user.create({
        data: { name: args.name, email: args.email, password: hash },
      });

      if (args.bio) {
        await prisma.profile.create({
          data: {
            userId: newUser.id,
            bio: args.bio,
          },
        });
      }

      const token = generateToken({ id: newUser.id });
      return { success: true, message: "SingUp successful", token };
    },

    signin: async (
      parent: any,
      args: { email: string; password: string },
      content: any
    ) => {
      const { email, password } = args;

      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!existingUser) {
        return { success: false, message: "User not found!", token: null };
      }

      const isPasswordMatches = bcrypt.compareSync(
        password,
        existingUser.password
      );

      if (!isPasswordMatches) {
        return { success: false, message: "Invalid password!", token: null };
      }

      const token = generateToken({ id: existingUser.id });
      return { success: true, message: "Login successfully", token };
    },
  },
};

export default resolvers;
