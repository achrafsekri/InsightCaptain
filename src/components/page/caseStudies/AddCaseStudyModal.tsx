import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@tremor/react";
import { InputText } from "primereact/inputtext";
import { Fragment, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { classNames } from "primereact/utils";
import * as yup from "yup";

const schema = yup.object().shape({
  title: yup.string().required("Title is required."),
  description: yup.string().required("description is required."),
});

type FormData = yup.InferType<typeof schema>;

const defaultValues = {
  title: "",
  description: "",
};

export default function AddCaseStudyModal({ isOpen, setIsOpen }) {
  const [loading, setLoading] = useState(false);
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

  const getFormErrorMessage = (code) => {
    return errors[code] ? (
      <small className="p-error">{errors[code].message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  });

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
                <form onSubmit={onSubmit}>
                  <div className="my-3 space-y-4">
                    <div>
                      <label
                        htmlFor="title"
                        className="text-900 mb-2 block font-medium"
                      >
                        Title
                      </label>

                      <Controller
                        name="title"
                        control={control}
                        rules={{ required: "title is required." }}
                        render={({ field, fieldState }) => (
                          <>
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
                            {getFormErrorMessage(field.title)}
                          </>
                        )}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="text-900 mb-2 block font-medium"
                      >
                        Description
                      </label>

                      <Controller
                        name="description"
                        control={control}
                        rules={{ required: "Description is required." }}
                        render={({ field, fieldState }) => (
                          <>
                            <InputText
                              {...field}
                              id="description"
                              type="text"
                              placeholder="Case study description"
                              className={classNames("w-72", {
                                "p-invalid": fieldState.error,
                              })}
                            />
                            {getFormErrorMessage(field.description)}
                          </>
                        )}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <Button type="submit">Create </Button>
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
