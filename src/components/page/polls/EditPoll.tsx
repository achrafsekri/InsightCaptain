import { Dialog, Transition } from "@headlessui/react";
import { InputText } from "primereact/inputtext";
import { Fragment, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { type Poll } from "@prisma/client";
import { classNames } from "primereact/utils";
import { Button } from "@tremor/react";
import { deletePoll, updatePoll } from "../../../lib/apiCalls";
import { useToast } from "../../../Context/ToastContext";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  poll: Poll;
  refetch: () => void;
};

const schema = yup.object().shape({
  title: yup.string().required(),
});

export default function EditPoll({ isOpen, setIsOpen, poll, refetch }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const showToast = useToast();

  const defaultValues = {
    title: poll.title,
  };
  const { handleSubmit, register, errors, control } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  function closeModal() {
    setIsOpen(false);
  }
  const handleEdit = (data) => {
    setLoading(true);
    const sendData = {
      pollTitle: data.title,
    };
    updatePoll(poll.id, sendData)
      .then((res) => {
        closeModal();
        refetch();
        showToast("success", "Poll updated successfully");
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        showToast("error", "Something went wrong");
        setLoading(false);
      });
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
              <Dialog.Panel className="w-full  max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Edit poll
                </Dialog.Title>

                <form onSubmit={handleSubmit(handleEdit)}>
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
                          <div className="flex flex-col">
                            {" "}
                            <InputText
                              {...field}
                              id="title"
                              type="text"
                              defaultValue={field.value}
                              placeholder="Poll title"
                              className={classNames("", {
                                "p-invalid": fieldState.error,
                              })}
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>
                  <div className="mt-8 flex gap-3">
                    <Button type="submit" loading={loading}>
                      Save{" "}
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
