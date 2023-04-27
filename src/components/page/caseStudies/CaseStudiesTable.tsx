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
import { useCaseStudy } from "../../../Context/CaseStudyContext";
import Link from "next/link";
import { useState } from "react";
import AddCaseStudyModal from "./AddCaseStudyModal";

const transactions = [
  {
    id: "#123456",
    name: "are you ok",
    surveys: "1",
    polls: "5",
    link: "#",
  },
  {
    id: "#234567",
    name: "is the world fucked",
    surveys: "7",
    polls: "8",
    link: "#",
  },
  {
    id: "#345678",
    name: "how are you feeling",
    surveys: "8",
    polls: "4",
    link: "#",
  },
  {
    id: "#4567890",
    name: "man of the houre",
    surveys: "7",
    polls: "8",
    link: "#",
  },
  {
    id: "#5678901",
    name: "pakistan war",
    surveys: "9",
    polls: "9",
    link: "#",
  },
  {
    id: "#6789012",
    name: "russia vs the usa",
    surveys: "7",
    polls: "8",
    link: "#",
  },
  {
    id: "#78901234",
    name: "china deals",
    surveys: "2",
    polls: "45",
    link: "#",
  },
  {
    id: "#89012345",
    name: "trafecing and drugs and how the affect your everyday life",
    surveys: "Oakley Jawbreaker",
    polls: "8",
    link: "#",
  },
];

export default function CaseStudiesTable() {
  const { caseStudies } = useCaseStudy();
  const [OpenAddCasestudyModale, setOpenAddCasestudyModale] = useState(false);
  return (
    <Card>
      {OpenAddCasestudyModale && (
        <AddCaseStudyModal
          isOpen={OpenAddCasestudyModale}
          setIsOpen={setOpenAddCasestudyModale}
        />
      )}
      <div className="flex items-center justify-between">
        <div>
          <Flex justifyContent="start" className="space-x-2">
            <Title>Case Studies</Title>
            <Badge color="gray">8</Badge>
          </Flex>
          <Text className="mt-2">Overview of your case Studies</Text>
        </div>
        <Button
          size="xs"
          variant="primary"
          color="blue"
          onClick={() => setOpenAddCasestudyModale(true)}
        >
          Add case study
        </Button>
      </div>

      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Case study Id</TableHeaderCell>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>N° surveys</TableHeaderCell>
            <TableHeaderCell>N° polls</TableHeaderCell>
            <TableHeaderCell>Link</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {caseStudies.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{"5"}</TableCell>
              <TableCell>{"6"}</TableCell>
              <TableCell>
                <Button size="xs" variant="secondary" color="gray">
                  <Link href={`/caseStudies/${item.id}`}>See details</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
