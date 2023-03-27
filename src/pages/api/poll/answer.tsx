import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../server/db";
import { formatResponse } from "../../../shared/sharedFunctions";

type RequestBody = {
  pickedOption: string;
  pollId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { pickedOption, pollId } = req.body as RequestBody;
  if (req.method === "POST") {
    try {
      const pollAnswer = await prisma.PollAnswer.create({
        data: {
          pollId: pollId as string,
          pollOptionId: pickedOption as string,
        },
      });
      res
        .status(200)
        .json(
          formatResponse(pollAnswer, "Poll answer created successfully", "201")
        );
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .json(formatResponse(null, "Error creating poll answer", "400"));
    }
  }
}
