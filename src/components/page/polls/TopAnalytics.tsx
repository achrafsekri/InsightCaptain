import { Card, Title, Text, Grid, Flex, Button } from "@tremor/react";
import React, { useState, type MouseEvent } from "react";
import ListChart from "../../global/ListChart";
import AgeGroupListChart from "../../global/AgeGroupListChart";
import { DocumentDownloadIcon, PlusCircleIcon } from "@heroicons/react/outline";
import RespondentsChart from "./RespondentsChart";
import AddPollModal from "./AddPollModal";


const TopAnalytics = ({stats}) => {
  return (
    <>
      {/* Main section */}
      <Card className="mt-6">
        <RespondentsChart />
      </Card>

      {/* KPI section */}
      <Grid numColsMd={2} className="mt-6 gap-6">
        <Card>
          <ListChart type="polls" countryWithMostResponses={stats.countryWithMostResponses} data={stats.countriesWithMostResponses} />
        </Card>
        <Card>
          <AgeGroupListChart type="polls" data={stats.ageGroupsData} />
        </Card>
      </Grid>
    </>
  );
};

export default TopAnalytics;
