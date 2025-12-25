import generateToken from "../../utils/jwtHelper.js";
import bcrypt from "bcryptjs";

interface ISignUpPayload {
  name: string;
  email: string;
  password: string;
  bio?: string;
}

export const authMutations = {
  signup: async (parent: any, args: ISignUpPayload, context: any) => {
    const prisma = context.prisma;

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
    context: any
  ) => {
    const prisma = context.prisma;

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
};
