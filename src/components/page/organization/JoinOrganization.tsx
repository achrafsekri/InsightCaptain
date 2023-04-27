import React from "react";
import { Controller, useForm, Resolver } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { BiArrowBack } from "react-icons/bi";
import { classNames } from "primereact/utils";
import Image from "next/image";

type FormValues = {
  code: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.code ? values : {},
    errors: !values.code
      ? {
          code: {
            type: "required",
            message: "This is required.",
          },
        }
      : {},
  };
};

const JoinOrganization = ({ setStep }) => {
  const [avatar, setAvatar] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({ resolver });

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
        className=" flex h-full w-full  items-center justify-center  "
      >
        <div className="flex gap-8 items-end">
          <Controller
            name="code"
            control={control}
            rules={{ required: "Value is required." }}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2 -mb-8">
                <small className="w-72 items-start text-sm italic">
                  * Please enter the invitation code provided by your
                  organization.
                </small>
                <InputText
                  {...register("code")}
                  placeholder="Invitation Code"
                  className={classNames("w-72", {
                    "p-invalid": fieldState.error,
                  })}
                />

                {getFormErrorMessage(field.name)}
              </div>
            )}
          />

          <div className="flex justify-end h-10 gap-4 ">
            <Button
              label="Join"
              type="submit"
              loading={loading}
              icon="pi pi-check"
              className="p-button-outlined"
            />
            <Button label="Reset" type="reset" severity="danger" text />
          </div>
        </div>
      </form>
    </div>
  );
};

export default JoinOrganization;
