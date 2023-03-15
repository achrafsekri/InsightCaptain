export const formatResponse = (data: any, message: string, status: string) => {
  return {
    data: data,
    message: message,
    status: status,
  };
};
