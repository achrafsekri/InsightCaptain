import { Role, SurveyFeild, type User } from "@prisma/client";
import axios from "axios";
import { baseUrl } from "../shared/constants";
import { type CaseStudy } from "@prisma/client";
import { type CreateOrganizationBody } from "../types/apiCalls";
import { prisma } from "../server/db";
import { SurveysStats } from "../types/SurveyPollTypes";
import { DateRangePickerValue } from "@tremor/react";

export const getLocation = async () => {
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  const response = await axios.get("https://api.country.is").then((res) => {
    const country = regionNames.of(res.data.country as string);
    return {
      country: country,
      countryCode: res.data.country,
      ip: res.data.ip,
    };
  });
  return response;
};

export const getUser = async (userId: string | undefined) => {
  const response = await axios
    .get(`${baseUrl}/api/auth/users/${userId}`)
    .catch((error) => {
      console.log(error);
    });
  return response.data.data as User;
};

export const getCaseStudies = async (organizationId: string) => {
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

export const editOrganization = async (
  organizationId: string,
  data: {
    name: string;
    image?: string;
  }
) => {
  const packageData = JSON.stringify(data);
  const config = {
    method: "patch",
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/organization/${organizationId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: packageData,
  };
  const response = await axios.request(config).catch((error) => {
    console.log(error);
  });
  return response.data;
};

//! fix server error

export const joinOrganization = async (
  invitation: string,
  userId: string | undefined
) => {
  const data = JSON.stringify({
    userId,
  });
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/organization/join/${invitation}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  const response = await axios.request(config).catch((error) => {
    console.log(error);
  });
  return response.data;
};

export const RemoveUserFromOrganization = async (
  organizationId: string,
  userId: string
) => {
  const response = await axios
    .delete(`${baseUrl}/api/organization/${organizationId}/users/${userId}`)
    .catch((error) => {
      console.log(error);
    });
  return response.data;
};

export const inviteUserToOrganization = async (
  organizationId: string,
  email: string,
  role: Role
) => {
  const data = JSON.stringify({
    email,
    organizationId: organizationId,
    role,
  });
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/invite`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  const response = await axios.request(config).catch((error) => {
    console.log(error);
  });
  return response.data;
};

export const getOrganizationInvitations = async (organizationId: string) => {
  const response = await axios
    .get(`${baseUrl}/api/organization/${organizationId}/invitations`)
    .catch((error) => {
      console.log(error);
    });
  return response.data.data;
};

export const deleteOrganizationInvitation = async (invitationId: string) => {
  const response = await axios
    .delete(`${baseUrl}/api/invite/${invitationId}`)
    .catch((error) => {
      console.log(error);
    });
  return response.data;
};

// stats

export const organizationStats = async (organizationId: string) => {
  const response = await axios
    .get(`${baseUrl}/api/organization/${organizationId}/statistics`)
    .catch((error) => {
      console.log(error);
    });

  if (response && response.data) {
    return response.data.data;
  } else {
    return {};
  }
};

export const getUsers = async (organizationId: string) => {
  const response = await axios
    .get(`${baseUrl}/api/organization/${organizationId}/users`)
    .catch((error) => {
      console.log(error);
    });
  return response.data.data;
};

export const updateUserRole = async (
  organizationId: string,
  userId: string,
  role: Role
) => {
  const data = JSON.stringify({
    role,
  });
  const config = {
    method: "patch",
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/organization/${organizationId}/users/${userId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  const response = await axios.request(config).catch((error) => {
    console.log(error);
  });
  return response.data;
};
// caseStudies

export const createCaseStudy = async (data, organizationId: string) => {
  const packageData = JSON.stringify(data);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/organization/${organizationId}/caseStudy`,
    headers: {
      "Content-Type": "application/json",
    },
    data: packageData,
  };

  const response = await axios.request(config).catch((error) => {
    console.log(error);
  });
  return response.data.data;
};

export const getCaseStudyStats = async (
  caseStudyId: string | undefined,
  organizationId: string
) => {
  const response = await axios.get(
    `${baseUrl}/api/organization/${organizationId}/caseStudy/${
      caseStudyId as string
    }/statistics`
  );
  return response.data.data;
};

export const getSurveysByCaseStudy = async (caseStudyId: string) => {
  const response = await axios
    .get(`${baseUrl}/api/survey/caseStudy/${caseStudyId}`)
    .catch((error) => {
      console.log(error);
      return [];
    });
  return response.data.data;
};

export const getPollsByCaseStudy = async (caseStudyId: string) => {
  const response = await axios
    .get(`${baseUrl}/api/poll/caseStudy/${caseStudyId}`)
    .catch((error) => {
      console.log(error);
      return [];
    });
  return response.data.data;
};

// surveys

export const getSurveysByOrganization = async (organizationId: string) => {
  const response = await axios
    .get(`${baseUrl}/api/survey/organization/${organizationId}`)
    .catch((error) => {
      console.log(error);
      return [];
    });
  return response.data.data;
};

export const getRespondantsChart = async (
  organizationId: string,
  range: DateRangePickerValue
) => {
  const data = JSON.stringify({
    organizationId: organizationId,
    range: range,
  });

  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: "http://localhost:3000/api/survey/respondantsRange",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  const response = await axios.request(config).catch((error) => {
    console.log(error);
  });
  return response.data.data;
};

export const getSurveysStatics = async (organizationId: string) => {
  const data = JSON.stringify({
    organizationId,
  });
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/survey/statistics`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  const response = await axios.request(config).catch((error) => {
    console.log(error);
  });
  return response.data.data as SurveysStats;
};

export const createSurvey = async (data) => {
  const packageData = JSON.stringify(data);
  console.log(packageData);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/survey`,
    headers: {
      "Content-Type": "application/json",
    },
    data: packageData,
  };
  const response = await axios.request(config).catch((error) => {
    console.log(error);
  });
  return response.data.data;
};

export const getSurvey = async (surveyId: string) => {
  const response = await axios.get(`${baseUrl}/api/survey/${surveyId}`);
  return response.data.data;
};

export const updateSurvey = async (surveyId: string, data) => {
  const packageData = JSON.stringify(data);
  let config = {
    method: "patch",
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/survey/${surveyId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: packageData,
  };
  const response = await axios.request(config).catch((error) => {
    console.log(error);
  });
  return response.data.data;
};

export const getRespondantsHistory = async (
  surveyId: string,
  range: DateRangePickerValue
) => {
  const data = JSON.stringify({
    range: range,
  });
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/survey/${surveyId}/respondantsRange`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  const response = await axios.request(config).catch((error) => {
    console.log(error);
  });

  return response.data.data;
};

export const getSurveyStats = async (surveyId: string) => {
  const response = await axios.get(
    `${baseUrl}/api/survey/${surveyId}/statistics`
  );
  return response.data.data;
};

export const deleteSurvey = async (surveyId: string) => {
  console.log("surveyId", surveyId);
  const response = await axios
    .delete(`${baseUrl}/api/survey/${surveyId}`)
    .catch((error) => {
      console.log(error);
    });
  return response.data;
};

export const getSurveyAnswers = async (surveyId: string) => {
  const response = await axios
    .get(`${baseUrl}/api/survey/${surveyId}/answer`)
    .catch((error) => {
      console.log(error);
    });
  return response.data.data;
};

export const getSurveyKeywords = async (surveyId: string) => {
  const response = await axios
    .get(`${baseUrl}/api/survey/${surveyId}/keywords`)
    .catch((error) => {
      console.log(error);
    });
  console.log(response.data);
  return response.data.data;
};

export const getSurveyResponseById = async (responseId: string) => {
  const response = await axios
    .get(`${baseUrl}/api/survey/ab/answer/${responseId}`)
    .catch((error) => {
      console.log(error);
    });
  return response.data.data;
};

// survey fields

export const createSurveyField = async (data, surveyId: string) => {
  const packageData = JSON.stringify(data);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/survey/${surveyId}/surveyField`,
    headers: {
      "Content-Type": "application/json",
    },
    data: packageData,
  };
  const response = await axios.request(config).catch((error) => {
    console.log(error);
  });
  return response.data.data;
};

export const updateSurveyField = async (
  surveyFieldId: string,
  surveyId: string,
  data
) => {
  const packageData = JSON.stringify(data);
  let config = {
    method: "patch",
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/survey/${surveyId}/surveyField/${surveyFieldId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: packageData,
  };
  const response = await axios.request(config).catch((error) => {
    console.log(error);
  });
  return response.data.data;
};

export const deleteSurveyField = async (
  surveyFieldId: string,
  surveyId: string
) => {
  const response = await axios
    .delete(`${baseUrl}/api/survey/${surveyId}/surveyField/${surveyFieldId}`)
    .catch((error) => {
      console.log(error);
    });
  return response.data;
};

export const reorderSurveyFields = async (surveyId: string, data: any) => {
  const packageData = JSON.stringify(data);
  let config = {
    method: "patch",
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/survey/${surveyId}/surveyField/reorderFields`,
    headers: {
      "Content-Type": "application/json",
    },
    data: packageData,
  };
  const response = await axios.request(config).catch((error) => {
    console.log(error);
  });
  return response.data.data;
};

// survey field Ai
export const generateQuations = async (surveyId: string) => {
  const data = JSON.stringify({
    surveyId: surveyId,
  });
  console.log(data);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/AI/surveyQuestSugg`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  const response = await axios.request(config).catch((error) => {
    console.log(error);
    return [];
  });
  return response.data.data;
};

// polls

export const getPollsByOrganization = async (organizationId: string) => {
  const response = await axios
    .get(`${baseUrl}/api/poll/organization/${organizationId}`)
    .catch((error) => {
      console.log(error);
      return [];
    });
  return response.data.data;
};

export const getPollsStats = async (organizationId: string) => {
  const data = JSON.stringify({
    organizationId,
  });
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/poll/statistics`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  const response = await axios.request(config).catch((error) => {
    console.log(error);
  });
  return response.data.data;
};

export const getPollsRespondantsHistory = async (
  organizationId: string,
  range: DateRangePickerValue
) => {
  const data = JSON.stringify({
    range: range,
    organizationId,
  });
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/poll/respondantsRange`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  const response = await axios.request(config).catch((error) => {
    console.log(error);
  });
  return response.data.data;
};

export const getPollRespondantsHistory = async (
  pollId: string,
  range: DateRangePickerValue
) => {
  const data = JSON.stringify({
    range: range,
  });
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/poll/${pollId}/respondantsRange`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  const response = await axios.request(config).catch((error) => {
    console.log(error);
  });
  return response.data.data;
};

export const getPollStats = async (pollId: string) => {
  const response = await axios.get(`${baseUrl}/api/poll/${pollId}/statistics`);
  return response.data.data;
};

export const createPoll = async (data) => {
  const packageData = JSON.stringify(data);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/poll`,
    headers: {
      "Content-Type": "application/json",
    },
    data: packageData,
  };
  const response = await axios.request(config).catch((error) => {
    console.log(error);
  });
  return response.data.data;
};

export const getPollById = async (pollId: string) => {
  const response = await axios.get(`${baseUrl}/api/poll/${pollId}`);
  return response.data.data;
};

export const updatePoll = async (pollId: string, data) => {
  const packageData = JSON.stringify(data);
  let config = {
    method: "patch",
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/poll/${pollId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: packageData,
  };
  const response = await axios.request(config).catch((error) => {
    console.log(error);
  });
  console.log(response.data);
  return response.data.data;
};

export const deletePoll = async (pollId: string) => {
  const response = await axios
    .delete(`${baseUrl}/api/poll/${pollId}`)
    .catch((error) => {
      console.log(error);
    });
  return response.data;
};

export const getPollResponseById = async (responseId: string) => {
  const response = await axios
    .get(`${baseUrl}/api/poll/ab/answer/${responseId}`)
    .catch((error) => {
      console.log(error);
    });
  return response.data.data;
};

// respond to poll

export const respondToPoll = async (data) => {
  const packageData = JSON.stringify(data);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/poll/answer`,
    headers: {
      "Content-Type": "application/json",
    },
    data: packageData,
  };
  const response = await axios.request(config).catch((error) => {
    console.log(error);
  });
  return response.data;
};

// respond to survey
export const respondToSurvey = async (data, surveyId: string) => {
  const packageData = JSON.stringify(data);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/api/survey/${surveyId}/answer`,
    headers: {
      "Content-Type": "application/json",
    },
    data: packageData,
  };
  const response = await axios.request(config).catch((error) => {
    console.log(error);
  });
  return response.data;
};
