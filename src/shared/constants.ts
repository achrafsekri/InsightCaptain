export const baseUrl = "http://localhost:3000";

export const publicRoutes = ["/auth/signin", "/auth/signup", "/404", "/text"];

export const NumericMonth = {
  "1": "Jan",
  "2": "Feb",
  "3": "Mar",
  "4": "Apr",
  "5": "May",
  "6": "Jun",
  "7": "Jul",
  "8": "Aug",
  "9": "Sept",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec",
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
