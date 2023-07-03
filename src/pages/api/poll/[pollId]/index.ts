import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../server/db";
import { formatResponse } from "../../../../shared/sharedFunctions";
import { Poll } from "@prisma/client";

type PatchBody = {
  pollTitle?: string;
  question?: string;
  helperText?: string;
  options?: {
    id: string;
    title: string;
    votes?: number;
    totalVotes?: number;
  }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { pollId } = req.query;
      const poll = await prisma.poll.findUnique({
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
    const { pollTitle, options, question, helperText } = req.body as PatchBody;
    try {
      pollTitle &&
        (await prisma.poll.update({
          where: {
            id: pollId as string,
          },
          data: {
            title: pollTitle,
            question: question,
            helperText: helperText,
          },
        }));

      options?.map(async (option) => {
        if (option.id) {
          await prisma.pollOption.update({
            where: {
              id: option.id,
            },
            data: {
              title: option.title,
            },
          });
        } else {
          await prisma.pollOption.create({
            data: {
              title: option.title,
              poll: {
                connect: {
                  id: pollId as string,
                },
              },
            },
          });
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
    console.log(pollId);
    try {
      const poll = await prisma.poll.findUnique({
        where: {
          id: pollId as string,
        },
      });
      console.log(poll);
      if (!poll) {
        return res
          .status(400)
          .json(formatResponse(null, "Poll not found", "400"));
      }
      await prisma.pollOption.deleteMany({
        where: {
          pollId: pollId as string,
        },
      });
      await prisma.poll.delete({
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
