import React from "react";
import { Controller, useForm, Resolver } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { BiArrowBack } from "react-icons/bi";
import { Ripple } from "primereact/ripple";
import { classNames } from "primereact/utils";
import Image from "next/image";

type FormValues = {
  avatar: string;
  name: string;
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

const CreateOrganization = ({ setStep }) => {
  const [avatar, setAvatar] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({ resolver });

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="p-error">{errors[name].message}</small>
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
  return (
    <div className="h-full relative w-full px-12 py-6">
      <Button
        className="left-6 font-smibold  items-center text-sm flex z-50 absolute top-6 hover:opacity-80*"
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
          <Controller
            control={control}
            name="avatar"
            render={({ field: { onChange, value } }) => (
              <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-lg p-2">
                <div className="absolute inset-0 z-10 bg-black bg-opacity-30" />
                <div className=" z-20 flex items-center justify-center p-5">
                  <div>
                    <label
                      htmlFor="button-avatar"
                      className="flex cursor-pointer p-4 "
                    >
                      <input
                        accept="image/*"
                        className="hidden"
                        id="button-avatar"
                        type="file"
                        onChange={async (e) => {
                          function readFileAsync() {
                            return new Promise((resolve, reject) => {
                              const file = e.target.files[0];
                              setAvatar(file);
                              if (!file) {
                                return;
                              }
                              const reader = new FileReader();

                              reader.onload = () => {
                                resolve(
                                  `data:${file.type};base64,${btoa(
                                    reader.result
                                  )}`
                                );
                              };

                              reader.onerror = reject;

                              reader.readAsBinaryString(file);
                            });
                          }

                          const newImage = await readFileAsync();

                          onChange(newImage);
                        }}
                      />
                      <i className="pi pi-upload text-white " />
                      <Ripple />
                    </label>
                  </div>

                  <Button
                    icon="pi pi-trash"
                    onClick={() => {
                      setAvatar(null);
                      onChange("");
                    }}
                    text
                    severity="danger"
                  />
                </div>

                {!!value && (
                  <Image
                    src={value}
                    className="absolute inset-0 m-auto"
                    width={80}
                    height={80}
                    alt="organization avatar"
                  />
                )}
              </div>
            )}
          />
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
