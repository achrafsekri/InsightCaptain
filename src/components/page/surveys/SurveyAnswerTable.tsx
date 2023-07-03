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
import { InputText } from "primereact/inputtext";
import AddSurveyModal from "./AddSurveyModal";
import { SurveyAnswer } from "@prisma/client";

const formatDate = (date: Date) => {
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

type Props = {
  data: SurveyAnswer[];
};

const SurveyAnswerTable = ({ data }: Props) => {
  const [OpenAddSurveyModale, setOpenAddSurveyModale] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filteredSurveys = data.filter((survey) =>
    survey.fullName?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <Card>
      {OpenAddSurveyModale && (
        <AddSurveyModal
          isOpen={OpenAddSurveyModale}
          setIsOpen={setOpenAddSurveyModale}
        />
      )}
      <div className="flex items-center justify-between">
        <div>
          <Flex justifyContent="start" className="space-x-2">
            <Title>Survey Responses</Title>
            <Badge color="gray">{data.length}</Badge>
          </Flex>
          <Text className="mt-2">Case study name</Text>
        </div>
        <span className="p-input-icon-left relative">
          <i className="pi pi-search absolute left-0 top-7" />
          <InputText
            type="text"
            className=" p-inputtext-sm my-4 w-60 md:w-96"
            placeholder="Search by survey title"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </span>
        
      </div>

      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Survey answer Id</TableHeaderCell>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Response date</TableHeaderCell>
            <TableHeaderCell>View response</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredSurveys.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.fullName}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{formatDate(item.createdAt)}</TableCell>
              <TableCell>
                <Button size="xs" variant="secondary" color="gray">
                  <Link href={`/surveys/response/${item.id}`}>See Response</Link>
                </Button>
              </TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default SurveyAnswerTable;
