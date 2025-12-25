import { authMutations } from "./auth.mutation.js";
import { postMutations } from "./post.mutation.js";

export const Mutation: any = {
  ...authMutations,
  ...postMutations,
};
