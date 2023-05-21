import React, { useState } from "react";
import { Card, Title, Text, Flex, Button } from "@tremor/react";
import { DocumentDownloadIcon, PlusCircleIcon } from "@heroicons/react/outline";
import AddPollModal from "../../components/page/polls/AddPollModal";
import MainLayout from "../../layouts/MainLayout";
import TopAnalytics from "../../components/page/polls/TopAnalytics";
import PollTable from "../../components/page/polls/PollTable";
import PollKeywords from "../../components/page/polls/PollKeywords";

const Index = () => {
  const [OpenAddPollModale, setOpenAddPollModale] = useState(false);
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
            <Title>Poll Title</Title>
            <Text>An overview of your olls</Text>
          </div>
          <div>
            <Button icon={DocumentDownloadIcon} className="mt-4">
              Export
            </Button>
            <Button
              icon={PlusCircleIcon}
              className="mt-4 ml-2"
              onClick={() => setOpenAddPollModale(true)}
            >
              Add Poll
            </Button>
          </div>
        </Flex>
        <TopAnalytics />
        <Card className="mt-6">
          <PollTable />
        </Card>
        <div className="mt-6">
          <PollKeywords />
        </div>
      </main>
    </MainLayout>
  );
};

export default Index;
