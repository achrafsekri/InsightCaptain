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

const surveys = [
  {
    id: "0",
    title: "survey1",
    description: "smalll description",
    numberOfRespondats: "300",
  },
  {
    id: "1",
    title: "survey2",
    description: "smalll description",
    numberOfRespondats: "300",
  },
  {
    id: "2",
    title: "survey3",
    description: "smalll description",
    numberOfRespondats: "300",
  },
  {
    id: "3",
    title: "survey4",
    description: "smalll description",
    numberOfRespondats: "300",
  },
  {
    id: "4",
    title: "survey5",
    description: "smalll description",
    numberOfRespondats: "300",
  },
  {
    id: "5",
    title: "survey6",
    description: "smalll description",
    numberOfRespondats: "300",
  },
  {
    id: "6",
    title: "survey4",
    description: "smalll description",
    numberOfRespondats: "300",
  },
  {
    id: "7",
    title: "survey5",
    description: "smalll description",
    numberOfRespondats: "300",
  },
  {
    id: "8",
    title: "survey6",
    description: "smalll description",
    numberOfRespondats: "300",
  },
];

const SurveyTable = () => {
  const [OpenAddSurveyModale, setOpenAddSurveyModale] = useState(false);
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <Flex justifyContent="start" className="space-x-2">
            <Title>Surveys</Title>
            <Badge color="gray">8</Badge>
          </Flex>
          <Text className="mt-2">Overview of your Surveys</Text>
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
            <TableHeaderCell>N° respondants</TableHeaderCell>

            <TableHeaderCell>Link</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {surveys.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.numberOfRespondats}</TableCell>

              <TableCell>
                <Button size="xs" variant="secondary" color="gray">
                  <Link href={`/surveys/${item.id}`}>See details</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default SurveyTable;
