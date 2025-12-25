import type { PostStatus } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { checkUserPostAccess } from "../../utils/checkPostAccess.js";

export const postMutations = {
  addPost: async (
    parent: any,
    args: { post: { title: string; content: string } },
    { decodedToken, prisma }: any
  ) => {
    const { title, content } = args.post;

    if (!decodedToken) {
      return {
        data: null,
        success: false,
        message: "Unauthorized access",
      };
    }

    if (!title || !content) {
      return {
        data: null,
        success: false,
        message: "Title and content are required!",
      };
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId: decodedToken.id,
      },
    });

    return {
      data: newPost,
      success: true,
      message: "Post created successfully.",
    };
  },

  updatePost: async (
    parent: any,
    args: { postId: number; post: { title: string; content: string } },
    { decodedToken }: any
  ) => {
    const { title, content } = args.post;

    if (!title && !content) {
      return {
        data: null,
        success: false,
        message: "Title or content is required!",
      };
    }

    if (!args.postId) {
      return {
        data: null,
        success: false,
        message: "Post id is required!",
      };
    }
    if (!decodedToken) {
      return {
        data: null,
        success: false,
        message: "Unauthorized access",
      };
    }

    const hasAccess = await checkUserPostAccess(decodedToken.id, args.postId);
    if (!hasAccess?.success) {
      return hasAccess;
    }

    const updatedData: { title?: string; content?: string } = {};
    if (title) updatedData.title = title;
    if (content) updatedData.content = content;

    const updatedPost = await prisma.post.update({
      where: { id: args.postId },
      data: updatedData,
    });

    return {
      data: updatedPost,
      success: true,
      message: "Post updated successfully.",
    };
  },

  updatePostStatus: async (
    parent: any,
    args: { postId: number; published: PostStatus },
    { decodedToken }: any
  ) => {
    const { postId, published } = args;

    if (!postId || !published) {
      return {
        data: null,
        success: false,
        message: "Post ID and publishing status are required!",
      };
    }

    if (!decodedToken) {
      return {
        data: null,
        success: false,
        message: "Unauthorized access",
      };
    }

    const hasAccess = await checkUserPostAccess(decodedToken.id, args.postId);
    if (!hasAccess?.success) {
      return hasAccess;
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        published,
      },
    });

    return {
      data: updatedPost,
      success: true,
      message: `Post ${published} successfully.`,
    };
  },

  deletePost: async (
    parent: any,
    args: { postId: number },
    { decodedToken }: any
  ) => {
    if (!args.postId) {
      return {
        data: null,
        success: false,
        message: "Post id is required!",
      };
    }
    if (!decodedToken) {
      return {
        data: null,
        success: false,
        message: "Unauthorized access",
      };
    }

    const hasAccess = await checkUserPostAccess(decodedToken.id, args.postId);
    if (!hasAccess?.success) {
      return hasAccess;
    }

    await prisma.post.delete({
      where: { id: args.postId },
    });

    return {
      data: null,
      success: true,
      message: "Post deleted successfully.",
    };
  },
};
