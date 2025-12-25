import { prisma } from "../lib/prisma.js";

import generateToken from "../utils/jwtHelper.js";
import * as allQueries from "./query/index.js";
import * as allMutations from "./mutation/index.js";

const resolvers: any = {
  Query: allQueries.Query,

  Profile: allQueries.Profile,
  User: allQueries.User,
  Post: allQueries.Post,

  Mutation: allMutations.Mutation,
};

export default resolvers;
