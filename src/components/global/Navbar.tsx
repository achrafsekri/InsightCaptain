"use client";

import { Fragment, useRef } from "react";
import { usePathname } from "next/navigation";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { routes } from "../../shared/routes";
import Logo from "../../shared/Logo";
import {
  LogoutIcon,
  PencilAltIcon,
  SwitchVerticalIcon,
} from "@heroicons/react/outline";
import { useState } from "react";
import SwitchOrganizationModal from "./SwitchOrganizationModal";
import { Toast } from "primereact/toast";
import { User } from "@prisma/client";
import { useRouter } from "next/router";

type ToastProps = {
  state: string;
  organizationName: string;
};

type ToastRef = {
  show: (props: ToastProps) => void;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useRef(null);
  const [switchOrganizationModalOpen, setSwitchOrganizationModalOpen] =
    useState(false);

  const showToast = (state: string, organizationName: string) => {
    toast.current.show({
      severity: state,
      summary: state,
      detail: `You have switched to ${organizationName}`,
      life: 3000,
    });
  };
  return (
    <>
      <Toast ref={toast} position="bottom-left" />
      {switchOrganizationModalOpen && (
        <SwitchOrganizationModal
          isOpen={switchOrganizationModalOpen}
          setIsOpen={setSwitchOrganizationModalOpen}
          showToast={showToast}
        />
      )}
      <Disclosure as="nav" className="bg-white shadow-sm">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <Logo />
                  </div>
                  <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                    {routes.map((item, index) => (
                      <a
                        key={index}
                        href={item.href}
                        className={classNames(
                          pathname === item.href
                            ? "border-slate-500 text-gray-900"
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                          "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                        )}
                        aria-current={
                          pathname === item.href ? "page" : undefined
                        }
                      >
                        {item.lable}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        <Image
                          className="h-8 w-8 rounded-full"
                          src={user?.image || "https://avatar.vercel.sh/leerob"}
                          height={32}
                          width={32}
                          alt={`${user?.name || "placeholder"} avatar`}
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "flex w-full px-4 py-2 text-sm text-gray-700"
                              )}
                              onClick={() =>
                                setSwitchOrganizationModalOpen(true)
                              }
                            >
                              <SwitchVerticalIcon className="mr-2 h-5 w-5 text-gray-400" />
                              Switch organization
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "flex w-full px-4 py-2 text-sm text-gray-700"
                              )}
                              onClick={() => router.push("/organization/edit")}
                            >
                              <PencilAltIcon className="mr-2 h-5 w-5 text-gray-400" />
                              Edit organization
                            </button>
                          )}
                        </Menu.Item>

                        {user ? (
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "flex w-full px-4 py-2 text-sm text-gray-700"
                                )}
                                onClick={() => {
                                  signOut().catch((err) => console.log(err));
                                }}
                              >
                                <LogoutIcon className="mr-2 h-5 w-5 text-gray-400" />
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        ) : null}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                {/* <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div> */}
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pt-2 pb-3">
                {routes.map((item, index) => (
                  <Disclosure.Button
                    key={index}
                    as="a"
                    href={item.href}
                    className={classNames(
                      pathname === item.href
                        ? "border-slate-500 bg-slate-50 text-slate-700"
                        : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800",
                      "block border-l-4 py-2 pl-3 pr-4 text-base font-medium"
                    )}
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    {item.lable}
                  </Disclosure.Button>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 pb-3">
                {user ? (
                  <>
                    <div className="flex items-center px-4">
                      <div className="flex-shrink-0">
                        <Image
                          className="h-8 w-8 rounded-full"
                          src={
                            user.image?.toString() ||
                            "https://avatar.vercel.sh/leerob"
                          }
                          height={32}
                          width={32}
                          alt={`${user.name ? user.name : "user"} avatar`}
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-gray-800">
                          {user.name}
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <button
                        onClick={() => {
                          signOut().catch((err) => console.log(err));
                        }}
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mt-3 space-y-1">
                    <button
                      onClick={() => {
                        signIn("github").catch((err) => console.log(err));
                      }}
                      className="flex w-full px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Sign in
                    </button>
                  </div>
                )}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}
