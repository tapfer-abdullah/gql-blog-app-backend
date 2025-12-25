import { prisma } from "../../lib/prisma.js";

export const Query = {
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

  posts: async () => {
    return await prisma.post.findMany({
      where: {
        published: "Published",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  post: async (parent: any, args: { id: number }, context: any) => {
    return await prisma.post.findFirst({
      where: {
        id: args.id,
        published: "Published",
      },
    });
  },

  myPosts: async (parent: any, args: any, { decodedToken }: any) => {
    if (!decodedToken) {
      return {
        data: null,
        success: false,
        message: "Unauthorized access!",
      };
    }

    const result = await prisma.post.findMany({
      where: {
        authorId: decodedToken.id,
        published: "Published",
      },
    });

    return {
      data: result,
      success: true,
      message: "Your posts retrieved successfully",
    };
  },
};

export const Profile = {
  user: async (parent: any, args: any, context: any) => {
    return prisma.user.findUnique({ where: { id: parent.userId } });
  },
};

export const User = {
  profile: async (parent: any, args: any, context: any) => {
    return prisma.profile.findUnique({ where: { userId: parent.id } });
  },

  posts: async (parent: any, args: any, context: any) => {
    if (context?.decodedToken && context?.decodedToken?.id === parent.id) {
      return await prisma.post.findMany({
        where: {
          authorId: parent.id,
        },
      });
    } else {
      return await prisma.post.findMany({
        where: {
          authorId: parent.id,
          published: "Published",
        },
      });
    }
  },
};

export const Post = {
  author: async (parent: any, args: any, context: any) => {
    return await prisma.user.findUnique({ where: { id: parent.authorId } });
  },
};
