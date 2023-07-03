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
import { type PollAnswer } from "@prisma/client";

const formatIsoDate = (date: Date) => {
  return new Date(date).toLocaleDateString();
};

type Props = {
  responses: PollAnswer[];
};

const PollResponseTable = ({ responses }: Props) => {
  const [OpenAddPollModale, setOpenAddPollModale] = useState(false);
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <Flex justifyContent="start" className="space-x-2">
            <Title>Polls</Title>
            <Badge color="gray">{responses?.length}</Badge>
          </Flex>
        </div>
      </div>

      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeaderCell>poll answer Id</TableHeaderCell>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>View response</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {responses?.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.fullName}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{formatIsoDate(item.createdAt)}</TableCell>

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

export default PollResponseTable;
