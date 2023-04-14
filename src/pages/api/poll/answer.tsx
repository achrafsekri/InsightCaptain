import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../server/db";
import { formatResponse } from "../../../shared/sharedFunctions";

type RequestBody = {
  pickedOption: string;
  pollId: string;
  location?: string;
  ipAddress?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { pickedOption, pollId, location, ipAddress } = req.body as RequestBody;
  if (req.method === "POST") {
    try {
      const pollAnswer = await prisma.pollAnswer.create({
        data: {
          pollId: pollId,
          pollOptionId: pickedOption,
          location: location?.toLowerCase(),
          ipAddress: ipAddress,
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
