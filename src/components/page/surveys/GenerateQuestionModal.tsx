import { Dialog, Transition } from "@headlessui/react";
import { Card, Icon } from "@tremor/react";
import { InputText } from "primereact/inputtext";
import { Fragment, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import * as yup from "yup";
import { Dropdown } from "primereact/dropdown";
import { useToast } from "../../../Context/ToastContext";
import { generateQuations } from "../../../lib/apiCalls";
import { useSingleSurvey } from "../../../pages/surveys/[surveyId]/edit";
import { useQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { CheckIcon } from "@heroicons/react/outline";

type AddPollModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setPickedQuestion: (question: string) => void;
};

export default function GenerateQuestionModal({
  isOpen,
  setIsOpen,
  setPickedQuestion,
}: AddPollModalProps) {
  const showToast = useToast();
  const { survey } = useSingleSurvey();
  const {
    data: quetions,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(["quetions"], () => generateQuations(String(survey.id)));

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
                  Pick a question
                </Dialog.Title>
                {isLoading && <p>Loading...</p>}
                {isError && <p>{error}</p>}
                {!isLoading && !isError && (
                  <div className="mt-2">
                    {Object.entries(quetions)?.map((question) => (
                      <Card className="mb-4" key={question[0]}>
                        <div className="flex flex-col">
                          <div className="flex justify-between items-center gap-8 mb-2">
                            <p className="w-fit text-lg font-medium leading-6 text-gray-900">
                              {question[0]}
                            </p>
                            <Icon
                              icon={CheckIcon}
                              onClick={() => {
                                setPickedQuestion(question[1]);
                                closeModal();
                              }}
                              variant="solid"
                              tooltip="Pick this question"
                              size="sm"
                              className="cursor-pointer"
                            />
                          </div>
                          <p className="text-sm font-medium leading-6 text-gray-900">
                            {question[1]}
                          </p>
                        </div>
                      </Card>
                    ))}
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
