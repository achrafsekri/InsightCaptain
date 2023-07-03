import { Card, Title, Text, Grid, Flex, Button } from "@tremor/react";
import React, { useState, type MouseEvent } from "react";
import SurveyeesChart from "./SurveySurveyeesChart";
import ListChart from "../../global/ListChart";
import AgeGroupListChart from "../../global/AgeGroupListChart";
import {
  DocumentDownloadIcon,
  PencilAltIcon,
  PlusCircleIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import AddSurveyModal from "./AddSurveyModal";
import { type SurveysStats } from "../../../types/SurveyPollTypes";

type TopAnalyticsProps = {
  statistics: SurveysStats;
  refetch: () => void;
};

const TopAnalytics = ({ statistics, refetch }: TopAnalyticsProps) => {
  const [openAddSurveyModal, setOpenAddSurveyModal] = useState(false);
  return (
    <>
      {openAddSurveyModal && (
        <AddSurveyModal
          isOpen={openAddSurveyModal}
          setIsOpen={setOpenAddSurveyModal}
        />
      )}
      <Flex className="justify-between">
        <div>
          <Title>Surveys insights</Title>
          <Text>An overview of your surveys analytics</Text>
        </div>
        <div>
          <Button
            icon={PlusCircleIcon}
            className="mt-4 ml-4"
            onClick={() => setOpenAddSurveyModal(true)}
          >
            Add survey
          </Button>
        </div>
      </Flex>

      {/* Main section */}
      <Card className="mt-6">
        <SurveyeesChart />
      </Card>

      {/* KPI section */}
      <Grid numColsMd={2} className="mt-6 gap-6">
        <Card>
          <ListChart
            type="surveys"
            data={statistics.countriesWithMostResponses}
            countryWithMostResponses={statistics.CountryWithMostResponses}
          />
        </Card>
        <Card>
          <AgeGroupListChart type="surveys" data={statistics.ageGroupsData} />
        </Card>
      </Grid>
    </>
  );
};

export default TopAnalytics;
