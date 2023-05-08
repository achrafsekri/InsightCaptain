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
  
  const SurveyAnswerTable = () => {
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
              <Title>Survey Responses</Title>
              <Badge color="gray">8</Badge>
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
              <TableHeaderCell>Action</TableHeaderCell>
            </TableRow>
          </TableHead>
  
          <TableBody>
            {filteredSurveys.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.numberOfRespondats}</TableCell>
  
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
  
  export default SurveyAnswerTable;
  