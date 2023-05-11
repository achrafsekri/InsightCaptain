import React from "react";
import { useUser } from "../../auth/UserContext";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Organization, userOrganization } from "@prisma/client";
import { classNames } from "primereact/utils";
import { Avatar } from "primereact/avatar";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const SwitchOrganizationModal = ({ isOpen, setIsOpen }: Props) => {
  const { user } = useUser();
  const setOrganization = (organization: Organization) => {
    console.log(organization);
  };

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
                  {user?.organizations?.map(
                    (organization: userOrganization, index: number) => (
                      <button
                        key={index}
                        onClick={(e) => setOrganization(organization.organization)}
                        className="p-link mb-2 flex w-full items-center rounded-md border-2 border-gray-800 p-2"
                      >
                        {/* //! need to add pic */}
                        <Avatar
                          image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                          className="mr-2"
                          shape="circle"
                        />
                        <div className="align flex flex-col">
                          <span className="font-bold">
                            {organization.organization.name}
                          </span>
                          <span className="text-sm">{organization.role}</span>
                        </div>
                      </button>
                    )
                  )}
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
