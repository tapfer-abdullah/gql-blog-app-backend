import { prisma } from "../lib/prisma.js";

export const checkUserPostAccess = async (userId: number, postId: number) => {
  const loginUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!loginUser) {
    return {
      data: null,
      success: false,
      message: "Unauthorized access. User not found!",
    };
  }

  const isPostExist = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!isPostExist) {
    return {
      data: null,
      success: false,
      message: "Post does not exist!",
    };
  }

  if (isPostExist.authorId !== loginUser.id) {
    return {
      data: null,
      success: false,
      message: "Forbidden access",
    };
  }

  return {
    success: true,
  };
};
