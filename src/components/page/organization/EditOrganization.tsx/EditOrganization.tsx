import React, { use } from "react";
import { Controller, useForm, Resolver, Field } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { BiArrowBack } from "react-icons/bi";
import { Ripple } from "primereact/ripple";
import { classNames } from "primereact/utils";
import Image from "next/image";
import { UploadImage } from "../UploadImage";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "../../../../server/uploadthing";
import { Card, Icon, Title } from "@tremor/react";
import { TrashIcon } from "@heroicons/react/outline";
import {
  editOrganization,
  getOrganizationInvitations,
  getUser,
  getUsers,
} from "../../../../lib/apiCalls";
import { useUser } from "../../../../auth/UserContext";
import { useRouter } from "next/router";
import { useOrganization } from "../../../../Context/OrganizationContext";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "../../../../Context/ToastContext";
import UsersTable from "./UsersTable";
import { useQuery } from "@tanstack/react-query";
import { invite, userOrganization } from "@prisma/client";
import InvitationTable from "./InvitationsTable";

type FormValues = {
  avatar: string;
  name: string;
};

type res = {
  fileUrl: string;
};

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  image: yup.string(),
});

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

const EditOrganization = () => {
  const { user } = useUser();
  const showToast = useToast();
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const { currentOrganization } = useOrganization();
  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<userOrganization>(["users"], () =>
    getUsers(String(currentOrganization?.id))
  );
  const {
    data: invitations,
    isLoading: invitationsIsLoading,
    isError: invitationsIsError,
    error: invitationsError,
    refetch: invitationsRefetch,
  } = useQuery<invite[]>(["invitations"], () =>
    getOrganizationInvitations(String(currentOrganization?.id))
  );
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    resetFiles,
    files,
    startUpload,
  } = useUploadThing("imageUploader");

  const defaultValues = {
    name: currentOrganization?.name,
    image: currentOrganization?.image,
  };
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const getFormErrorMessage = (name: string) => {
    return errors[name] ? (
      <small className="p-error">{errors[name].message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };
  const onSubmit = handleSubmit((data) => {
    setLoading(true);

    const sendData = {
      name: data.name,
      image: "",
    };
    editOrganization(currentOrganization.id, sendData)
      .then((res) => {
        setLoading(false);
        showToast("success", "Organization updated successefuly");
        router.push("/organization/edit").catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
        showToast("error", "Error updating organization");
        setLoading(false);
      });

    // startUpload()
    //   .then((res: res[]) => {
    //     const sendData = {
    //       name: data.name,
    //       image: typeof res[0] !== "undefined" ? res[0].fileUrl : "",
    //     };
    //     editOrganization(currentOrganization.id, sendData)
    //       .then((res) => {
    //         setLoading(false);
    //         router.push("/dashboard").catch((err) => console.log(err));
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //         setLoading(false);
    //       });
    //   })
    //   .catch((err) => {
    //     console.log("uploadthing error: ", err);
    //     setLoading(false);
    //   });
  });
  return (
    <>
      <Card className="h-96">
        <Title className="">Edit Organization info</Title>
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
                    width="400"
                    height="400"
                  />
                )}
                {currentOrganization?.image && (
                  <Image
                    src={currentOrganization?.image}
                    alt="Image"
                    width="400"
                    height="400"
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
              label="Save Changes"
              type="submit"
              icon="pi pi-check"
              loading={loading}
              className="p-button-outlined"
            />
          </div>
        </form>
      </Card>
      <Card className=" mt-8">
        <Title className="">Edit Organization users</Title>
        {!isLoading && <UsersTable users={users} refetch={refetch} />}
        {!invitationsIsLoading && !invitationsIsError && (
          <InvitationTable invites={invitations} refetch={invitationsRefetch} />
        )}
      </Card>
    </>
  );
};

export default EditOrganization;
