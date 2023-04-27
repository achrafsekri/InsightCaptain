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
  
  const polls = [
    {
      id: "0",
      title: "poll1",
      description: "smalll description",
      numberOfRespondats: "300",
    },
    {
      id: "1",
      title: "poll2",
      description: "smalll description",
      numberOfRespondats: "300",
    },
    {
      id: "2",
      title: "poll3",
      description: "smalll description",
      numberOfRespondats: "300",
    },
    {
      id: "3",
      title: "poll4",
      description: "smalll description",
      numberOfRespondats: "300",
    },
    {
      id: "4",
      title: "poll5",
      description: "smalll description",
      numberOfRespondats: "300",
    },
    {
      id: "5",
      title: "poll6",
      description: "smalll description",
      numberOfRespondats: "300",
    },
    {
      id: "6",
      title: "poll4",
      description: "smalll description",
      numberOfRespondats: "300",
    },
    {
      id: "7",
      title: "poll5",
      description: "smalll description",
      numberOfRespondats: "300",
    },
    {
      id: "8",
      title: "poll6",
      description: "smalll description",
      numberOfRespondats: "300",
    },
  ];
  
  const PollTable = () => {
    const [OpenAddPollModale, setOpenAddPollModale] = useState(false);
    return (
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <Flex justifyContent="start" className="space-x-2">
              <Title>Polls</Title>
              <Badge color="gray">8</Badge>
            </Flex>
            <Text className="mt-2">Overview of your polls</Text>
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
              <TableHeaderCell>N° respondants</TableHeaderCell>
  
              <TableHeaderCell>Link</TableHeaderCell>
            </TableRow>
          </TableHead>
  
          <TableBody>
            {polls.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.numberOfRespondats}</TableCell>
  
                <TableCell>
                  <Button size="xs" variant="secondary" color="gray">
                    <Link href={`/polls/${item.id}`}>See details</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  };
  
  export default PollTable;
  