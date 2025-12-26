import type { User } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma.js";
import DataLoader from "dataloader";

const batchUsers = async (ids: readonly number[]): Promise<(User | null)[]> => {
  // ids = [1, 2, 3]
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: [...ids],
      },
    },
  });

  /*
    data format: 
    -----------
    1: {id: 1, name: ak}
    2: {id: 2, name: bk}
    */

  // we using it to make sure the data is being return in the same order as the input comes
  const formattedUsers: { [key: number]: User } = {};
  users.forEach((user) => {
    formattedUsers[user.id] = user;
  });

  // return type should be array of object
  // input [1,2]
  /**
   * output
   * [
   *    {id: 1, name: ak},
   *    {id: 2, name: bk}
   * ]
   */

  return ids.map((id) => formattedUsers[id] ?? null);
};

export const userLoader = new DataLoader<number, User | null>(batchUsers);
