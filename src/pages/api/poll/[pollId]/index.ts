import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../server/db";
import { formatResponse } from "../../../../shared/sharedFunctions";
import { Poll } from "@prisma/client";

type PatchBody = {
  pollTitle: string;
  options: {
    id: string;
    title: string;
  }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { pollId } = req.query;
      const poll: Poll = await prisma.Poll.findUnique({
        where: {
          id: pollId as string,
        },
        include: {
          options: {
            include: {
              PollAnswers: true,
            },
          },
        },
      });

      if (!poll) {
        res.status(400).json(formatResponse(null, "Poll not found", "400"));
      } else {
        poll.options.map((option) => {
          option.votes = option.PollAnswers.length;
        });
        poll.totalVotes = poll.options.reduce(
          (acc, option) => acc + option.votes,
          0
        );

        res
          .status(200)
          .json(formatResponse(poll, "Poll fetched successfully", "200"));
      }
    } catch (err) {
      console.error(err);
      res.status(400).json(formatResponse(null, "error fetching poll", "400"));
    }
  }

  if (req.method === "PATCH") {
    const { pollId } = req.query;
    const { pollTitle, options } = req.body as PatchBody;
    try {
      pollTitle &&
        (await prisma.Poll.update({
          where: {
            id: pollId as string,
          },
          data: {
            title: pollTitle,
          },
        }));

      options?.map(async (option) => {
        const optionExists = await prisma.PollOption.findUnique({
          where: {
            id: option.id,
          },
        });

        if (optionExists) {
          await prisma.PollOption.update({
            where: {
              id: option.id,
            },
            data: {
              title: option.title,
            },
          });
        } else {
          res.status(400).json(formatResponse(null, "Option not found", "400"));
        }
      });
      res.status(200).json(formatResponse(null, "Poll updated", "200"));
    } catch (err) {
      console.error(err);
      res.status(400).json(formatResponse(null, "error updating poll", "400"));
    }
  }

  if (req.method === "DELETE") {
    const { pollId } = req.query;
    try {
      await prisma.Poll.delete({
        where: {
          id: pollId as string,
        },
      });
      res
        .status(200)
        .json(formatResponse(null, "Poll deleted successfully", "200"));
    } catch (err) {
      res.status(400).json(formatResponse(null, "error deleting poll", "400"));
    }
  }
}
