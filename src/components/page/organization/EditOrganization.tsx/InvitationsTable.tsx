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
  Divider,
} from "@tremor/react";
import { Button as PrimeButton } from "primereact/button";
import Link from "next/link";
import { useState } from "react";
import { TrashIcon } from "@heroicons/react/outline";
import { Ripple } from "primereact/ripple";
import { InputText } from "primereact/inputtext";
import { userOrganization, type Survey, invite } from "@prisma/client";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useToast } from "../../../../Context/ToastContext";
import {
  RemoveUserFromOrganization,
  deleteOrganizationInvitation,
  deleteSurvey,
} from "../../../../lib/apiCalls";
import InviteUserModale from "./InviteUserModale";
import { useOrganization } from "../../../../Context/OrganizationContext";
import EditUser from "./EditUser";

const formatIsoDate = (date: Date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US");
};

type Props = {
  invites: invite[];
  refetch: () => void;
};

const InvitationTable = ({ invites, refetch }: Props) => {
  const [OpenInviteUserModale, setOpenInviteUserModale] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const showToast = useToast();
  const { currentOrganization } = useOrganization();

  const filteredInvitations = invites.filter((invite) =>
    invite.email.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleDeleteInvitation = (inviteId: string) => {
    setLoading(true);
    deleteOrganizationInvitation(inviteId)
      .then((res) => {
        refetch();
        showToast("success", "Invitation deleted successfully");
        setLoading(false);
      })
      .catch((err) => {
        showToast("error", "Error deleting invitation");
        setLoading(false);
      });
  };

  return (
    <Card className="mt-4">
      {OpenInviteUserModale && (
        <InviteUserModale
          isOpen={OpenInviteUserModale}
          setIsOpen={setOpenInviteUserModale}
          refetch={refetch}
        />
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <Flex justifyContent="start" className="space-x-2">
            <Title>Invitations</Title>
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
          onClick={() => setOpenInviteUserModale(true)}
        >
          Invite User
        </Button>
      </div>

      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Created at</TableHeaderCell>
            <TableHeaderCell>Role</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Action</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredInvitations &&
            filteredInvitations.map((item, index) => (
              <>
                <TableRow key={index}>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{formatIsoDate(item.createdAt)}</TableCell>
                  <TableCell>
                    {item.role == "OWNER" || item.role == "ADMIN"
                      ? "ADMIN"
                      : "USER"}
                  </TableCell>
                  <TableCell>
                    {item.status == "PENDING" ? (
                      <Badge color="yellow">Pending</Badge>
                    ) : item.status == "ACCEPTED" ? (
                      <Badge color="green">Accepted</Badge>
                    ) : (
                      <Badge color="red">Declined</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <PrimeButton
                      onClick={() => {
                        handleDeleteInvitation(item.id);
                      }}
                      loading={loading}
                      text
                      severity="danger"
                      icon={<TrashIcon className="h-5 w-5" />}
                      className="flex items-center justify-center rounded-lg p-2 text-red-400 hover:bg-red-500 hover:text-white"
                    >
                      <Ripple />
                    </PrimeButton>
                  </TableCell>
                </TableRow>
              </>
            ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default InvitationTable;
