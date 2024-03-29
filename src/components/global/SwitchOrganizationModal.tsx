import React, { useRef } from "react";
import { useUser } from "../../auth/UserContext";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Organization, User, userOrganization } from "@prisma/client";

import { Avatar } from "primereact/avatar";
import { useOrganization } from "../../Context/OrganizationContext";
import { Ripple } from "primereact/ripple";
import { useRouter } from "next/router";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { Divider } from "@tremor/react";
import { Button } from "primereact/button";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  showToast: (state: string, organizationName: string) => void;
};

const SwitchOrganizationModal = ({ isOpen, setIsOpen, showToast }: Props) => {
  const { currentOrganization, setCurrentOrganization } = useOrganization();
  const { user }: { user: User } = useUser();
  const router = useRouter();

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Switch organization
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    You are currently signed in to {`current organization`}.
                    Would you like to switch to another organization?
                  </p>
                </div>
                <div className="mt-8 flex flex-col gap-6">
                  {
                    //@ts-ignore
                    user?.organizations?.map(
                      (organization: userOrganization, index: number) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();
                            localStorage.setItem(
                              "currentOrganization",
                              JSON.stringify(organization.organization)
                            );
                            setCurrentOrganization(organization.organization);
                            showToast(
                              "success",
                              organization.organization.name
                            );
                            window.location.reload();
                            setIsOpen(false);
                          }}
                          className={
                            currentOrganization.id ===
                            organization.organization?.id
                              ? " relative mb-2 flex w-full items-center rounded-md border-blue-200 bg-blue-100 p-2  focus:border-2"
                              : " relative mb-2 flex w-full items-center rounded-md border-blue-200 p-2  focus:border-2 "
                          }
                        >
                          {organization.organization.image && (
                            <Avatar
                              image={organization.organization.image}
                              className="mr-2"
                              shape="circle"
                            />
                          )}
                          {!organization.organization.image && (
                            <Avatar
                              label={organization.organization.name[0].toUpperCase()}
                              style={{
                                backgroundColor: "#2196F3",
                                color: "#ffffff",
                              }}
                              className="mr-2"
                              shape="circle"
                            />
                          )}
                          <div className=" flex flex-col items-start">
                            <span className="font-bold capitalize">
                              {organization.organization.name}
                            </span>
                            <span className="text-sm">
                              {organization.role?.toLowerCase() === "admin" ||
                              organization.role?.toLowerCase() === "owner"
                                ? "Admin"
                                : "Member"}
                            </span>
                          </div>
                          <Ripple />
                        </button>
                      )
                    )
                  }
                  <Divider />
                  <Button
                    onClick={(e) => {
                      router.push("/organization").catch((err) => {});
                    }}
                    className={
                      " relative mb-2 flex w-full items-center gap-2 rounded-md border-blue-200 bg-blue-50 p-2  focus:border-2 "
                    }
                    label="Create / Join organization"
                    icon="pi pi-plus-circle"
                  >
                    <Ripple />
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SwitchOrganizationModal;
