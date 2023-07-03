import { Dialog, Transition } from "@headlessui/react";
import { Button, Card, Title } from "@tremor/react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Fragment, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { classNames } from "primereact/utils";
import * as yup from "yup";
import { Button as PrimeButton } from "primereact/button";
import {
  createCaseStudy,
  inviteUserToOrganization,
} from "../../../../lib/apiCalls";
import { useOrganization } from "../../../../Context/OrganizationContext";
import { useMutation } from "@tanstack/react-query";
import { useCaseStudy } from "../../../../Context/CaseStudyContext";
import { useRouter } from "next/router";
import { useToast } from "../../../../Context/ToastContext";

const schema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  role: yup.string().required("Role is required"),
});

type FormData = yup.InferType<typeof schema>;

const defaultValues = {
  email: "",
  role: "",
};

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const roles = [
  { label: "Admin", value: "ADMIN" },
  { label: "Member", value: "MEMBER" },
];

export default function InviteUserModal({ isOpen, setIsOpen, refetch }: Props) {
  const [loading, setLoading] = useState(false);
  const [invitationCode, setInvitationCode] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { currentOrganization } = useOrganization();
  const router = useRouter();
  const showToast = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const getFormErrorMessage = (name: string) => {
    return <small className="p-error mt-2">{errors[name]?.message}</small>;
  };

  const onSubmit = (data: FormData) => {
    setLoading(true);

    inviteUserToOrganization(currentOrganization.id, data.email, data.role)
      .then((res) => {
        setInvitationCode(res.data.invitationCode);
        showToast("success", "Case study created");
        refetch();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        showToast("error", "Something went wrong");
      });
  };

  function closeModal() {
    setIsOpen(false);
  }
  const copyToClipboard = () => {
    navigator.clipboard.writeText(invitationCode);
  };

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
                  Invite user to organization
                </Dialog.Title>
                {!invitationCode && (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="my-3 space-y-4">
                      <div>
                        <label
                          htmlFor="title"
                          className="text-900 mb-2 block font-medium"
                        >
                          Email <span className="text-red-500">*</span>
                        </label>

                        <Controller
                          name="email"
                          control={control}
                          rules={{ required: "title is required." }}
                          render={({ field, fieldState }) => (
                            <div className="flex flex-col">
                              {" "}
                              <InputText
                                {...field}
                                id="title"
                                type="text"
                                placeholder="User email"
                                className={classNames("md:w-14rem w-full", {
                                  "p-invalid": fieldState.error,
                                })}
                              />
                              {errors.email && getFormErrorMessage("email")}
                            </div>
                          )}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="description"
                          className="text-900 mb-2 block font-medium"
                        >
                          Case study <span className="text-red-400">*</span>
                        </label>
                        <Controller
                          name="role"
                          control={control}
                          rules={{ required: "Role is required." }}
                          render={({ field, fieldState }) => (
                            <Dropdown
                              value={selectedOption}
                              focusInputRef={field.ref}
                              onChange={(e) => {
                                field.onChange(e.value);
                                setSelectedOption(e.value);
                              }}
                              options={roles}
                              optionLabel="label"
                              placeholder="Select a role"
                              className={classNames("md:w-14rem w-full", {
                                "p-invalid": fieldState.error,
                              })}
                            />
                          )}
                        />
                        {errors.role && getFormErrorMessage("role")}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <Button type="submit" loading={loading}>
                        Send invitation{" "}
                      </Button>
                      <Button type="submit" variant="secondary" color="red">
                        Cancel{" "}
                      </Button>
                    </div>
                  </form>
                )}
                {invitationCode && (
                  <div className="flex h-40 w-96 items-center justify-center">
                    <Card className="   ">
                      <Title className="mb-4">Invitation code</Title>
                      <InputText
                        placeholder="link"
                        disabled={true}
                        value={invitationCode}
                      />
                      <PrimeButton
                        icon="pi pi-copy"
                        onClick={copyToClipboard}
                      />
                    </Card>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
