import { Dialog, Transition } from "@headlessui/react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Fragment, useState } from "react";
import { useSingleSurvey } from "../../../pages/surveys/[surveyId]/edit";
import { useRouter } from "next/router";
import { useToast } from "../../../Context/ToastContext";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  type: "poll" | "survey";
};

export default function ShareModal({ isOpen, setIsOpen, type }: Props) {
  const router = useRouter();
  const { pollId } = router.query;
  const { surveyId } = router.query;
  const showToast = useToast();

  const ShareLink = `http://localhost:3000/respond/${
    type == "survey" ? "survey" : "poll"
  }/${type == "survey" ? surveyId : pollId}`;
  // copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(ShareLink);
    showToast("success", "Copied to clipboard");
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
              <Dialog.Panel className="w-full  max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Share survey
                </Dialog.Title>
                <div className="flex h-40 w-96 items-center justify-center">
                  <div className="p-inputgroup mx-auto   ">
                    <InputText
                      placeholder="link"
                      disabled={true}
                      value={ShareLink}
                    />
                    <Button icon="pi pi-copy" onClick={copyToClipboard} />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
