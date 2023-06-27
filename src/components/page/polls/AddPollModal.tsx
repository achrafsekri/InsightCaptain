import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@tremor/react";
import { InputText } from "primereact/inputtext";
import { Fragment, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { classNames } from "primereact/utils";
import * as yup from "yup";
import { Dropdown } from "primereact/dropdown";
import { useCaseStudy } from "../../../Context/CaseStudyContext";
import { createPoll } from "../../../lib/apiCalls";
import { useRouter } from "next/router";
import { useToast } from "../../../Context/ToastContext";

const schema = yup.object().shape({
  title: yup.string().required("Title is required."),
  description: yup.string().required("description is required."),
  caseStudy: yup.object().required("Case study is required."),
});

type FormData = yup.InferType<typeof schema>;
type AddPollModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  caseStudyId?: string;
};

const defaultValues = {
  title: "",
  description: "",
  caseStudy: null,
};

export default function AddPollModal({
  isOpen,
  setIsOpen,
  caseStudyId,
}: AddPollModalProps) {
  const { caseStudies } = useCaseStudy();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<
    string | null | undefined
  >(caseStudyId ? caseStudies?.find((c) => c.id === caseStudyId)?.title : null);
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

  const onSubmit = handleSubmit((data) => {
    setLoading(true);
    const sendData = {
      title: data.title,
      description: data.description,
      topic: data.caseStudy,
      caseStudyId: data.caseStudy.id as string,
      organizationId: data.caseStudy.organizationId as string,
    };
    createPoll(sendData)
      .then((res) => {
        setLoading(false);
        setIsOpen(false);
        showToast("success", "Poll created successfully");
        router.push(`/polls/${res.id}/edit`).catch((err) => {
          console.log(err);
        });
      })
      .catch((err) => {
        console.log(err);
        showToast("error", "Something went wrong");
        setLoading(false);
      });
  });

  function closeModal() {
    setIsOpen(false);
  }

  console.log("errors", errors);

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
                  Create Poll
                </Dialog.Title>
                <form onSubmit={onSubmit}>
                  <div className="my-3 space-y-3">
                    <div>
                      <label
                        htmlFor="title"
                        className="text-900 mb-2 block font-medium"
                      >
                        Title <span className="text-red-400">*</span>
                      </label>

                      <Controller
                        name="title"
                        control={control}
                        rules={{ required: "title is required." }}
                        render={({ field, fieldState }) => (
                          <div className="flex flex-col">
                            <InputText
                              {...field}
                              id="title"
                              type="text"
                              placeholder="Poll title"
                              className={classNames("w-full", {
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
                        Description <span className="text-red-400">*</span>
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
                              placeholder="Poll description"
                              className={classNames("w-full", {
                                "p-invalid": fieldState.error,
                              })}
                            />
                            {errors.description &&
                              getFormErrorMessage("description")}
                            <p className="mt-2 w-full text-sm italic text-gray-500 ">
                              {" "}
                              Description is required fro our machine learning
                              model to work properly.
                            </p>
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
                        name="caseStudy"
                        control={control}
                        rules={{ required: "Case study is required." }}
                        render={({ field, fieldState }) => (
                          <Dropdown
                            value={selectedOption}
                            focusInputRef={field.ref}
                            onChange={(e) => {
                              field.onChange(e.value);
                              setSelectedOption(e.value);
                            }}
                            options={caseStudies}
                            optionLabel="title"
                            placeholder="Select a Case Study"
                            className="md:w-14rem w-full"
                          />
                        )}
                      />
                      {errors.caseStudy && getFormErrorMessage("caseStudy")}
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <Button type="submit" loading={loading}>
                      Create{" "}
                    </Button>
                    <Button
                      onClick={closeModal}
                      variant="secondary"
                      color="red"
                    >
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
