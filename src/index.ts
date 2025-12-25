import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import typeDefs from "./schemas/index.js";
import resolvers from "./resolvers/index.js";
import { prisma } from "./lib/prisma.js";
import type { PrismaClient } from "../generated/prisma/client.js";
import type { GlobalOmitConfig } from "../generated/prisma/internal/prismaNamespace.js";
import type { DefaultArgs } from "@prisma/client/runtime/client.js";
import { verifyToken } from "./utils/jwtHelper.js";

interface TContext {
  prisma: PrismaClient<never, GlobalOmitConfig | undefined, DefaultArgs>;
  decodedToken: {
    id: number | null | undefined;
  };
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }): Promise<TContext> => {
    const decodedToken: any = verifyToken(req.headers.authorization as string);
    return { prisma, decodedToken };
  },
});

console.log(`🚀  Server ready at: ${url}`);
