export const formatResponse = (data: any, message: string, status: string) => {
  return {
    data: data,
    message: message,
    status: status,
  };
};

export function extractContentBetweenBrackets(input: string): string | null {
  const regex = /{([^}]*)}/;
  const match = input.match(regex);

  if (match && match.length >= 1) {
    return match[0].trim();
  }

  return null;
}
