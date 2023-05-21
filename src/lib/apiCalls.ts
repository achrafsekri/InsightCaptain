import { type User } from "@prisma/client";
import axios from "axios";
import { baseUrl } from "../shared/constants";
import { type CaseStudy } from "@prisma/client";
import { type CreateOrganizationBody } from "../types/apiCalls";

export const getUser = async (userId: string | undefined) => {
  const response = await axios
    .get(`${baseUrl}/api/auth/users/${userId}`)
    .catch((error) => {
      console.log(error);
    });
  console.log(response.data);
  return response.data.data as User;
};

export const getCaseStudies = async (organizationId: string) => {
  console.log("organization id",organizationId);
  const response = await axios
    .get(`${baseUrl}/api/organization/${organizationId}/caseStudy`)
    .catch((error) => {
      console.log(error);
    });

  if (response && response.data) {
    return response.data.data as CaseStudy[];
  } else {
    return [] as CaseStudy[];
  }
};

// organization

export const createOrganization = async (data) => {
  const packageData = JSON.stringify(data);
  console.log(data);
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/organization`,
    headers: {
      "Content-Type": "application/json",
    },
    data: packageData,
  };
  const response = await axios.request(config).catch((error) => {
    console.log(error);
  });

  if (response && response.data) {
    return response.data;
  }
};

//! fix server error

export const joinOrganization = async (
  invitation: string,
  userId: string | undefined
) => {
  const data = JSON.stringify({
    userId,
  });
  console.log(data);
  const response = await axios
    .post(`${baseUrl}/api/organization/join/${invitation}`, data)
    .catch((error) => {
      console.log(error);
    });

  if (response && response.data) {
    return response.data;
  }
};

// stats

export const organizationStats = async (organizationId: string) => {
  const response = await axios
    .get(`${baseUrl}/api/organization/${organizationId}/stats`)
    .catch((error) => {
      console.log(error);
    });

  if (response && response.data) {
    return response.data.data;
  } else {
    return {};
  }
};

// caseStudies

// surveys

// polls
