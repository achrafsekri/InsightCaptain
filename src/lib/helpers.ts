import { type SurveyFeild } from "@prisma/client";

export const reorder = (
  list: SurveyFeild[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  if (removed !== undefined) {
    result.splice(endIndex, 0, removed);
  }

  return result;
};
