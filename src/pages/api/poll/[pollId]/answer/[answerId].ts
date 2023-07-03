import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../../server/db";
import { formatResponse } from "../../../../../shared/sharedFunctions";
import { PollAnswer } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { answerId } = req.query;
    try {
      const pollAnswer: PollAnswer | null = await prisma.pollAnswer.findUnique({
        where: {
          id: String(answerId),
        },
        include: {
          poll: true,
        },
      });
      if (!pollAnswer) {
        return res
          .status(404)
          .json(formatResponse(null, "Answer not found", "404"));
      }

      return res.status(200).json(formatResponse(pollAnswer, "Success", "200"));
    } catch (error) {
      console.error(error);
      return res
        .status(400)
        .json(formatResponse(null, "Error getting answer", "400"));
    }
  }
}
