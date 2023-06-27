import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@tremor/react";
import { InputText } from "primereact/inputtext";
import { Fragment, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { classNames } from "primereact/utils";
import * as yup from "yup";
import { createCaseStudy } from "../../../lib/apiCalls";
import { useOrganization } from "../../../Context/OrganizationContext";
import { useMutation } from "@tanstack/react-query";
import { useCaseStudy } from "../../../Context/CaseStudyContext";
import { useRouter } from "next/router";
import { useToast } from "../../../Context/ToastContext";

const schema = yup.object().shape({
  title: yup.string().required("Title is required."),
  description: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

const defaultValues = {
  title: "",
  description: "",
};

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function AddCaseStudyModal({ isOpen, setIsOpen }: Props) {
  const [loading, setLoading] = useState(false);
  const { currentOrganization } = useOrganization();
  const { refetch } = useCaseStudy();
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
    const dataToSubmit = {
      title: data.title,
      description: data.description,
    };


    createCaseStudy(dataToSubmit, currentOrganization.id)
      .then((res) => {
        console.log(res);
        refetch();
        showToast("success", "Case study created");
        router.push(`/caseStudies/${res?.id}`).catch((err) => {
          console.log(err);
        });
        setIsOpen(false);
      })
      .catch((err) => {
        console.log(err);
        showToast("error", "Something went wrong");
      });
    setLoading(false);
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
                  Create case study
                </Dialog.Title>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="my-3 space-y-4">
                    <div>
                      <label
                        htmlFor="title"
                        className="text-900 mb-2 block font-medium"
                      >
                        Title <span className="text-red-500">*</span>
                      </label>

                      <Controller
                        name="title"
                        control={control}
                        rules={{ required: "title is required." }}
                        render={({ field, fieldState }) => (
                          <div className="flex flex-col">
                            {" "}
                            <InputText
                              {...field}
                              id="title"
                              type="text"
                              placeholder="Case study title"
                              className={classNames("w-72", {
                                "p-invalid": fieldState.error,
                              })}
                            />
                            {errors.title && getFormErrorMessage("title")}
                          </div>
                        )}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="text-900 mb-2 block font-medium"
                      >
                        Description <span className="text-gray-400">(optional)</span>
                      </label>

                      <Controller
                        name="description"
                        control={control}
                        rules={{ required: "Description is required." }}
                        render={({ field, fieldState }) => (
                          <div className="flex flex-col">
                            <InputText
                              {...field}
                              id="description"
                              type="text"
                              placeholder="Case study description"
                              className={classNames("w-72", {
                                "p-invalid": fieldState.error,
                              })}
                            />
                            {errors.description &&
                              getFormErrorMessage("description")}
                          </div>
                        )}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <Button type="submit" loading={loading}>Create </Button>
                    <Button type="submit" variant="secondary" color="red">
                      Cancel{" "}
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
