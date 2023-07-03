import React from "react";
import MainLayout from "../../layouts/MainLayout";
import EditOrganization from "../../components/page/organization/EditOrganization.tsx/EditOrganization";
import { useUser } from "../../auth/UserContext";
import { useOrganization } from "../../Context/OrganizationContext";

const Edit = () => {
  const { user } = useUser();
  const { currentOrganization } = useOrganization();
  const role = user.organizations.find(
    (org) => org.organizationId === currentOrganization.id
  ).role;
  console.log(role);
  return (
    <MainLayout>
      <main className="mx-auto max-w-7xl p-4 md:p-10">
        {(role === "ADMIN" || role === "OWNER") && <EditOrganization />}
        {role === "MEMBER" && (
          <div className="text-center text-2xl font-bold">
            You are not authorized to edit this organization
          </div>
        )}
      </main>
    </MainLayout>
  );
};

export default Edit;
