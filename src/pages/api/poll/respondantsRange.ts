import { NextApiRequest, NextApiResponse } from "next";
//
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../server/db";
import { formatResponse } from "../../../shared/sharedFunctions";
import { ageGroups } from "../../../shared/constants";
import { object } from "zod";

type Body = {
  organizationId: string;
  range: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(400).json(formatResponse(null, "Invalid request method", "400"));
  }
  if (req.method === "POST") {
    try {
      const { organizationId, range } = req.body as Body;
      const start = range[0];
      let end = range[1];
      const metric = range[2];

      if (!start && !end && !metric) {
        res
          .status(400)
          .json(formatResponse(null, "Invalid request body", "400"));
      }

      if (!end) {
        end = new Date(start).toISOString();
      }

      // add 1 day to end date
      const date = new Date(end);
      date.setDate(date.getDate() + 1);
      end = date.toISOString();

      if (!metric) {
        const respondants = await prisma.pollAnswer.groupBy({
          by: ["createdAt"],
          where: {
            poll: {
              organizationId: organizationId,
            },
            createdAt: {
              gte: new Date(start),
              lte: new Date(end),
            },
          },
        });

        // fil the days with 0
        const groupByDay = respondants.reduce((acc, curr) => {
          const date = new Date(curr.createdAt).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = 1;
          } else {
            acc[date] += 1;
          }
          return acc;
        }, {});
        //fill the rest of the days with 0 between start and end we need to subtract start from end and get the days
        const days = Math.floor(
          (new Date(end).getTime() - new Date(start).getTime()) /
            (1000 * 3600 * 24)
        );
        const lastMonth = {};
        for (let i = 0; i < days; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toLocaleDateString();
          if (!groupByDay[dateStr]) {
            lastMonth[dateStr] = 0;
          } else {
            lastMonth[dateStr] = groupByDay[dateStr];
          }
        }
        res
          .status(200)
          .json(formatResponse(Object.entries(lastMonth), "Success", "200"));
      }
      const respondents = await prisma.pollAnswer.groupBy({
        by: ["createdAt"],
        where: {
          poll: {
            organizationId: organizationId,
          },
          createdAt: {
            gte: new Date(start),
            lte: new Date(end),
          },
        },
      });
      console.log("respondants", respondents);

      if (metric === "w") {
        const groupByDay = respondents.reduce((acc, curr) => {
          const date = new Date(curr.createdAt).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = 1;
          } else {
            acc[date] += 1;
          }
          return acc;
        }, {});
        //fill the rest of the days with 0
        const lastWeek = {};
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toLocaleDateString();
          if (!groupByDay[dateStr]) {
            lastWeek[dateStr] = 0;
          } else {
            lastWeek[dateStr] = groupByDay[dateStr];
          }
        }

        res
          .status(200)
          .json(formatResponse(Object.entries(lastWeek), "Success", "200"));
      }

      if (metric === "tdy" || !metric) {
        const groupbyHour = respondents.reduce((acc, curr) => {
          const date = new Date(curr.createdAt).toLocaleDateString();
          const hour = new Date(curr.createdAt).getHours();
          if (!acc["date"]) {
            acc["date"] = {};
          }
          if (!acc["date"][hour]) {
            acc["date"][hour] = 1;
          } else {
            acc["date"][hour] += 1;
          }
          return acc;
        }, {});

        // fill the rest of day houres with 0
        Object.keys(groupbyHour).forEach((day) => {
          for (let i = 0; i < 24; i++) {
            if (!groupbyHour[day][i]) {
              groupbyHour[day][i] = 0;
            }
          }
        });

        //if no data for today
        if (!groupbyHour["date"]) {
          groupbyHour["date"] = {};
          for (let i = 0; i < 24; i++) {
            groupbyHour["date"][i] = 0;
          }
        }

        // map i to hours like "0" to "00:00"
        Object.keys(groupbyHour).forEach((day) => {
          const dayObj = groupbyHour[day];
          const dayObjKeys = Object.keys(dayObj);
          const dayObjValues = Object.values(dayObj);
          const dayObjEntries = Object.entries(dayObj);
          const newDayObj = {};
          dayObjEntries.forEach((entry) => {
            const [key, value] = entry;
            const newKey = `${key}:00`;
            newDayObj[newKey] = value;
          });
          groupbyHour[day] = newDayObj;
        });

        res
          .status(200)
          .json(
            formatResponse(Object.entries(groupbyHour.date), "Success", "200")
          );
      }

      if (metric === "y") {
        const groupByMonth = respondents.reduce((acc, curr) => {
          const month = new Date(curr.createdAt).getMonth();
          if (!acc["date"]) {
            acc["date"] = {};
          }
          if (!acc["date"][month]) {
            acc["date"][month] = 1;
          } else {
            acc["date"][month] += 1;
          }
          return acc;
        }, {});
        // fill the rest of month with 0
        const lastYear = {};
        for (let i = 0; i < 12; i++) {
          console.log("i", groupByMonth.date[i]);
          if (!groupByMonth.date[i]) {
            lastYear[i] = 0;
          } else {
            lastYear[i] = groupByMonth.date[i];
          }
        }
        res
          .status(200)
          .json(formatResponse(Object.entries(lastYear), "Success", "200"));
      }

      if (metric === "t") {
        const groupByDay = respondents.reduce((acc, curr) => {
          const date = new Date(curr.createdAt).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = 1;
          } else {
            acc[date] += 1;
          }
          return acc;
        }, {});
        //fill the rest of the days with 0
        const lastMonth = {};
        for (let i = 0; i < 30; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toLocaleDateString();
          if (!groupByDay[dateStr]) {
            lastMonth[dateStr] = 0;
          } else {
            lastMonth[dateStr] = groupByDay[dateStr];
          }
        }

        res
          .status(200)
          .json(formatResponse(Object.entries(lastMonth), "Success", "200"));
      }
    } catch {
      res
        .status(500)
        .json(formatResponse(null, "Error getting respondants", "400"));
    }
  }
}
