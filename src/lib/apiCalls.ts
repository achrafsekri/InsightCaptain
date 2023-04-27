import { type User } from "@prisma/client";
import axios from "axios";
import { baseUrl } from "../shared/constants";
import { type CaseStudy } from "@prisma/client";

export const getUser = async (userId: string ) => {
  const response = await axios
    .get(`${baseUrl}/api/auth/users/${userId}`)
    .catch((error) => {
      console.log(error);
    });
  console.log(response.data);
  return response.data.data as User;
};

export const getCaseStudies = async (organizationId: string ) => {
  const response = await axios
    .get(`${baseUrl}/api/organization/${organizationId}/caseStudy`)
    .catch((error) => {
      console.log(error);
    });
  console.log(response.data);
  return response.data.data as CaseStudy[];
};
