export const baseUrl = "http://localhost:3000";

export const publicRoutes = [
  "/auth/signin",
  "/auth/signup",
  "/404",
  "/text",
  "/respond/poll/[pollId]",
  "/respond/survey/[surveyId]",
];

export const NumericMonth = {
  "0": "Jan",
  "1": "Feb",
  "2": "Mar",
  "3": "Apr",
  "4": "May",
  "5": "Jun",
  "6": "Jul",
  "7": "Aug",
  "8": "Sep",
  "9": "Oct",
  "10": "Nov",
  "11": "Dec",
};

export const ageGroups = [
  {
    name: "Under 18",
    under: 17,
    over: 0,
  },
  {
    name: "18-24",
    under: 24,
    over: 18,
  },
  {
    name: "25-34",
    under: 34,
    over: 25,
  },
  {
    name: "35-44",
    under: 44,
    over: 35,
  },
  {
    name: "45-54",
    under: 54,
    over: 45,
  },
  {
    name: "55-64",
    under: 64,
    over: 55,
  },
  {
    name: "65+",
    under: 140,
    over: 65,
  },
];
