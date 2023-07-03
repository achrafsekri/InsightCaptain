import React, { useState } from "react";
import { Card, Title, Text, Flex, Button } from "@tremor/react";
import { DocumentDownloadIcon, PlusCircleIcon } from "@heroicons/react/outline";
import AddPollModal from "../../components/page/polls/AddPollModal";
import MainLayout from "../../layouts/MainLayout";
import TopAnalytics from "../../components/page/polls/TopAnalytics";
import PollTable from "../../components/page/polls/PollTable";
import PollKeywords from "../../components/page/polls/PollKeywords";
import { useQuery } from "@tanstack/react-query";
import { getPollsByOrganization, getPollsStats } from "../../lib/apiCalls";
import { useOrganization } from "../../Context/OrganizationContext";
import { Poll } from "@prisma/client";
import { SurveysStats } from "../../types/SurveyPollTypes";

const Index = () => {
  const [OpenAddPollModale, setOpenAddPollModale] = useState(false);
  const { currentOrganization } = useOrganization();

  const {
    data: polls,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Poll[]>(["polls"], () =>
    getPollsByOrganization(String(currentOrganization?.id))
  );

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsIsError,
    error: statsError,
    refetch: statsRefetch,
  } = useQuery<SurveysStats>(["stats"], () =>
    getPollsStats(String(currentOrganization?.id))
  );
  return (
    <MainLayout>
      {OpenAddPollModale && (
        <AddPollModal
          setIsOpen={setOpenAddPollModale}
          isOpen={OpenAddPollModale}
        />
      )}
      <main className="mx-auto max-w-7xl p-4 md:p-10">
        <Flex className="justify-between">
          <div>
            <Title>Polls</Title>
            <Text>An overview of your polls statistics and insights</Text>
          </div>
          <div>
            <Button
              icon={PlusCircleIcon}
              className="mt-4 ml-2"
              onClick={() => setOpenAddPollModale(true)}
            >
              Add Poll
            </Button>
          </div>
        </Flex>
        {!statsLoading && stats && <TopAnalytics stats={stats} />}
        <Card className="mt-6">
          {!isLoading && polls && <PollTable polls={polls} />}
        </Card>
      </main>
    </MainLayout>
  );
};

export default Index;
