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
import AddPollModal from "./AddPollModal";
import { Poll } from "@prisma/client";

type Props = {
  polls: Poll[];
};

// const polls = [
//   {
//     id: "0",
//     title: "poll1",
//     description: "smalll description",
//     numberOfRespondats: "300",
//   },
//   {
//     id: "1",
//     title: "poll2",
//     description: "smalll description",
//     numberOfRespondats: "300",
//   },
//   {
//     id: "2",
//     title: "poll3",
//     description: "smalll description",
//     numberOfRespondats: "300",
//   },
//   {
//     id: "3",
//     title: "poll4",
//     description: "smalll description",
//     numberOfRespondats: "300",
//   },
//   {
//     id: "4",
//     title: "poll5",
//     description: "smalll description",
//     numberOfRespondats: "300",
//   },
//   {
//     id: "5",
//     title: "poll6",
//     description: "smalll description",
//     numberOfRespondats: "300",
//   },
//   {
//     id: "6",
//     title: "poll4",
//     description: "smalll description",
//     numberOfRespondats: "300",
//   },
//   {
//     id: "7",
//     title: "poll5",
//     description: "smalll description",
//     numberOfRespondats: "300",
//   },
//   {
//     id: "8",
//     title: "poll6",
//     description: "smalll description",
//     numberOfRespondats: "300",
//   },
// ];

const PollTable = ({ polls }: Props) => {
  const [OpenAddPollModale, setOpenAddPollModale] = useState(false);
  const handleDelete = (id: string) => {
    console.log(id);
  };
  return (
    <Card>
      {OpenAddPollModale && (
        <AddPollModal
          setIsOpen={setOpenAddPollModale}
          isOpen={OpenAddPollModale}
        />
      )}
      <div className="flex items-center justify-between">
        <div>
          <Flex justifyContent="start" className="space-x-2">
            <Title>Polls</Title>
            <Badge color="gray">{polls?.length}</Badge>
          </Flex>
          <Text className="mt-2">Case study name</Text>
        </div>
        <Button
          size="xs"
          variant="primary"
          color="blue"
          onClick={() => setOpenAddPollModale(true)}
        >
          Add poll
        </Button>
      </div>

      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeaderCell>poll Id</TableHeaderCell>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Case study</TableHeaderCell>
            <TableHeaderCell>Link</TableHeaderCell>
            <TableHeaderCell>Action</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {polls?.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.caseStudy.title}</TableCell>

              <TableCell>
                <Button size="xs" color="blue" variant="primary">
                  <Link href={`/polls/${item.id}`}>See details</Link>
                </Button>
              </TableCell>
              <TableCell>
                <button
                  onClick={() => handleDelete(item.id)}
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

export default PollTable;
