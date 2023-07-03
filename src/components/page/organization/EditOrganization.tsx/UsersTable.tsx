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
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import { Ripple } from "primereact/ripple";
import { InputText } from "primereact/inputtext";
import { userOrganization, type Survey } from "@prisma/client";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useToast } from "../../../../Context/ToastContext";
import {
  RemoveUserFromOrganization,
  deleteSurvey,
} from "../../../../lib/apiCalls";
import InviteUserModale from "./InviteUserModale";
import { useOrganization } from "../../../../Context/OrganizationContext";
import EditUser from "./EditUser";

type Props = {
  users: userOrganization[];
  refetch: () => void;
};

const UserTable = ({ users, refetch }: Props) => {
  const [OpenInviteUserModale, setOpenInviteUserModale] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const showToast = useToast();
  const [selectedUser, setSelectedUser] = useState<userOrganization | null>(
    null
  );
  const [edit, setEdit] = useState(false);
  const { currentOrganization } = useOrganization();

  const filteredUsers = users.filter((user) =>
    user.user.email.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };
  const handleDelete = (userId) => {
    // delete survey logic here
  };

  const handleDeleteUser = (userId: string) => {
    setLoading(true);
    RemoveUserFromOrganization(currentOrganization?.id, userId)
      .then((res) => {
        refetch();
        showToast("success", "User removed successfully");
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        showToast("error", "Something went wrong");
        setLoading(false);
      });
  };

  return (
    <Card className="mt-4">
      <ConfirmDialog />
      {OpenInviteUserModale && (
        <InviteUserModale
          isOpen={OpenInviteUserModale}
          setIsOpen={setOpenInviteUserModale}
        />
      )}
      {edit && (
        <EditUser
          isOpen={edit}
          setIsOpen={setEdit}
          refetch={refetch}
          user={selectedUser}
        />
      )}
      <div className="flex items-center justify-between">
        <div>
          <Flex justifyContent="start" className="space-x-2">
            <Title>Users</Title>
            <Badge color="gray">{users?.length}</Badge>
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
        {/* <Button
          size="xs"
          variant="primary"
          color="blue"
          onClick={() => setOpenInviteUserModale(true)}
        >
          Invite User
        </Button> */}
        <div></div>
      </div>

      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Role</TableHeaderCell>
            <TableHeaderCell>Action</TableHeaderCell>
            {/* <TableHeaderCell>Action</TableHeaderCell> */}
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredUsers &&
            filteredUsers.map((item, index) => (
              <>
                <TableRow key={index}>
                  <TableCell>{item.user.email}</TableCell>
                  <TableCell>
                    {item.user.name ? item.user.name : "No name"}
                  </TableCell>
                  <TableCell>
                    {item.role == "OWNER" || item.role == "ADMIN"
                      ? "ADMIN"
                      : "USER"}
                  </TableCell>
                  <TableCell>
                    <PrimeButton
                      onClick={() => {
                        handleDeleteUser(item.user.id);
                      }}
                      loading={loading}
                      text
                      severity="danger"
                      icon={<TrashIcon className="h-5 w-5" />}
                      className="flex items-center justify-center rounded-lg p-2 text-red-400 hover:bg-red-500 hover:text-white"
                    >
                      <Ripple />
                    </PrimeButton>
                    <PrimeButton
                      onClick={() => {
                        setSelectedUser(item);
                        setEdit(true);
                      }}
                      loading={loading}
                      text
                      severity="info"
                      icon={<PencilIcon className="h-5 w-5" />}
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

export default UserTable;
