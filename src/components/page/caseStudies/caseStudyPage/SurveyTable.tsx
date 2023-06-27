import {
  Card,
  Title,
  Text,
  Flex,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  Badge,
  Button,
  Color,
} from "@tremor/react";
import Link from "next/link";
import { useState } from "react";
import { TrashIcon } from "@heroicons/react/outline";
import { Ripple } from "primereact/ripple";
import { deleteSurvey, getSurveysByCaseStudy } from "../../../../lib/apiCalls";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import AddSurveyModal from "../../surveys/AddSurveyModal";
import { Survey } from "@prisma/client";

// const surveys = [
//   {
//     id: "0",
//     title: "survey1",
//     description: "smalll description",
//     numberOfRespondats: "300",
//   },
//   {
//     id: "1",
//     title: "survey2",
//     description: "smalll description",
//     numberOfRespondats: "300",
//   },
//   {
//     id: "2",
//     title: "survey3",
//     description: "smalll description",
//     numberOfRespondats: "300",
//   },
//   {
//     id: "3",
//     title: "survey4",
//     description: "smalll description",
//     numberOfRespondats: "300",
//   },
//   {
//     id: "4",
//     title: "survey5",
//     description: "smalll description",
//     numberOfRespondats: "300",
//   },
//   {
//     id: "5",
//     title: "survey6",
//     description: "smalll description",
//     numberOfRespondats: "300",
//   },
//   {
//     id: "6",
//     title: "survey4",
//     description: "smalll description",
//     numberOfRespondats: "300",
//   },
//   {
//     id: "7",
//     title: "survey5",
//     description: "smalll description",
//     numberOfRespondats: "300",
//   },
//   {
//     id: "8",
//     title: "survey6",
//     description: "smalll description",
//     numberOfRespondats: "300",
//   },
// ];

const SurveyTable = () => {
  const [OpenAddSurveyModale, setOpenAddSurveyModale] = useState(false);
  const { caseStudyId } = useRouter().query;
  const {
    data: surveys,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Survey[]>(["surveys"], () =>
    getSurveysByCaseStudy(caseStudyId as string)
  );
  console.log("fe", caseStudyId);
  const handleDelete = (id: string) => {
    deleteSurvey(id)
      .then(() => {
        refetch().catch((err) => {
          console.log(err);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Card>
      {OpenAddSurveyModale && (
        <AddSurveyModal
          isOpen={OpenAddSurveyModale}
          setIsOpen={setOpenAddSurveyModale}
          caseStudyId={caseStudyId as string}
        />
      )}
      <div className="flex items-center justify-between">
        <div>
          <Flex justifyContent="start" className="space-x-2">
            <Title>Surveys</Title>
            <Badge color="gray">{!isLoading ? surveys?.length : "N/A"}</Badge>
          </Flex>
          <Text className="mt-2">Case study name</Text>
        </div>
        <Button
          size="xs"
          variant="primary"
          color="blue"
          onClick={() => setOpenAddSurveyModale(true)}
        >
          Add survey
        </Button>
      </div>

      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Survey Id</TableHeaderCell>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Description</TableHeaderCell>
            <TableHeaderCell>Link</TableHeaderCell>
            <TableHeaderCell>Action</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {!isLoading &&
            surveys.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.description}</TableCell>

                <TableCell>
                  <Button size="xs" variant="secondary" color="gray">
                    <Link href={`/surveys/${item.id}`}>See details</Link>
                  </Button>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => {
                      handleDelete(item.id);
                    }}
                    className="flex items-center justify-center rounded-lg p-2 text-red-400 hover:bg-red-500 hover:text-white"
                  >
                    <TrashIcon className="h-5 w-5" />
                    <Ripple />
                  </button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default SurveyTable;
