import React from "react";
import { Controller, useForm, Resolver, Field } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { BiArrowBack } from "react-icons/bi";
import { Ripple } from "primereact/ripple";
import { classNames } from "primereact/utils";
import Image from "next/image";
import { UploadImage } from "./UploadImage";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "../../../server/uploadthing";
import { Icon } from "@tremor/react";
import { TrashIcon } from "@heroicons/react/outline";
import { createOrganization } from "../../../lib/apiCalls";
import { useUser } from "../../../auth/UserContext";
import { useRouter } from "next/router";

type FormValues = {
  avatar: string;
  name: string;
};

type res = {
  fileUrl: string;
};

type Props = {
  setStep: React.Dispatch<React.SetStateAction<string>>;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.name ? values : {},
    errors: !values.name
      ? {
          name: {
            type: "required",
            message: "This is required.",
          },
        }
      : {},
  };
};
const { useUploadThing } = generateReactHelpers<OurFileRouter>();

const CreateOrganization = ({ setStep }: Props) => {
  const { user } = useUser();
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    resetFiles,
    files,
    startUpload,
  } = useUploadThing("imageUploader");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({ resolver });

  const getFormErrorMessage = (name: string) => {
    return errors[name] ? (
      <small className="p-error">{errors[name].message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };
  const onSubmit = handleSubmit((data) => {
    setLoading(true);
    if (files.length === 0) {
      const sendData = {
        name: data.name,
        image: "",
        userId: user?.id,
      };
      createOrganization(sendData)
        .then((res) => {
          setLoading(false);
          router.push("/dashboard").catch((err) => console.log(err));
        })
        .catch((err) => {
          console.log(err);
        });
    }
    startUpload()
      .then((res: res[]) => {
        const sendData = {
          name: data.name,
          image: typeof res[0] !== "undefined" ? res[0].fileUrl : "",
          userId: user?.id,
        };
        createOrganization(sendData)
          .then((res) => {
            setLoading(false);
            router.push("/dashboard").catch((err) => console.log(err));
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
  return (
    <div className="relative h-full w-full px-12 py-6">
      <Button
        className="font-smibold hover:opacity-80*  absolute left-6 top-6 z-50 flex items-center text-sm"
        text
        onClick={() => setStep("pick")}
      >
        <BiArrowBack className="mr-2" /> Back
      </Button>
      <form
        onSubmit={onSubmit}
        className="relative flex h-full w-full flex-col items-center justify-center"
      >
        <div className="flex  w-full items-center justify-center gap-6">
          <div
            {...getRootProps()}
            className="relative flex h-28 w-28 items-center justify-center  rounded-lg border-2 border-dashed p-2"
          >
            <input {...getInputProps()} />
            <div>
              {files.length > 0 && (
                <Image
                  src={files[0]?.contents ? files[0]?.contents : ""}
                  alt="Image"
                  width="80"
                  height="60"
                />
              )}
              {files.length > 0 && (
                <Icon
                  className="absolute -top-2 -right-2 cursor-pointer"
                  icon={TrashIcon}
                  onClick={() => resetFiles()}
                  variant="solid"
                  color="red"
                  size="xs"
                  tooltip="Remove image"
                />
              )}
              {files.length === 0 && (
                <p className="text-center text-gray-500">
                  Drag and drop an image here
                </p>
              )}
              <Ripple />
            </div>
          </div>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Value is required." }}
            render={({ field, fieldState }) => (
              <div className="flex-column align-items-center flex gap-2">
                <InputText
                  {...register("name")}
                  placeholder="Organization Name"
                  className={classNames("w-full", {
                    "p-invalid": fieldState.error,
                  })}
                />

                {getFormErrorMessage(field.name)}
              </div>
            )}
          />
        </div>
        <div className=" absolute  right-6 bottom-6 flex w-full justify-end gap-4 ">
          <Button
            label="Create Organization"
            type="submit"
            icon="pi pi-check"
            loading={loading}
            className="p-button-outlined"
          />
          <Button label="Reset" type="reset" severity="danger" text />
        </div>
      </form>
    </div>
  );
};

export default CreateOrganization;
