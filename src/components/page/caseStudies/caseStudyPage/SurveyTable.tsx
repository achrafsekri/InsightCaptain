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
import { useRouter } from "next/router";
import AddSurveyModal from "../../surveys/AddSurveyModal";
import { type Survey } from "@prisma/client";

type Props = {
  refetch: () => void;
  surveys: Survey[];
};
const SurveyTable = ({ refetch, surveys }: Props) => {
  const [OpenAddSurveyModale, setOpenAddSurveyModale] = useState(false);
  const { caseStudyId } = useRouter().query;

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
            <Badge color="gray">{surveys ? surveys?.length : "N/A"}</Badge>
          </Flex>
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
          {surveys &&
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
