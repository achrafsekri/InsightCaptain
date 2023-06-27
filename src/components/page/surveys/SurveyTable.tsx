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
import { type Survey } from "@prisma/client";

type Props = {
  surveys: Survey[] | undefined;
};

const SurveyTable = ({ surveys }: Props) => {
  const [OpenAddSurveyModale, setOpenAddSurveyModale] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filteredSurveys = surveys.filter((survey) =>
    survey.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };
  const handleDelete = (surveyId) => {
    // delete survey logic here
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
            <Title>Surveys</Title>
            <Badge color="gray">{surveys?.length}</Badge>
          </Flex>
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
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Case study</TableHeaderCell>
            <TableHeaderCell>N° respondants</TableHeaderCell>
            <TableHeaderCell>Link</TableHeaderCell>
            <TableHeaderCell>Action</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredSurveys &&
            filteredSurveys.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.caseStudy.title}</TableCell>
                <TableCell>{item._count.SurveyAnswer}</TableCell>

                <TableCell>
                  <Button size="xs" variant="secondary" color="gray">
                    <Link href={`/surveys/${item.id}`}>See details</Link>
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

export default SurveyTable;
