import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "../../../server/uploadthing";
import { Avatar } from "primereact/avatar";
import { useEffect, useState } from "react";
import { Image } from "primereact/image";
import { Icon } from "@tremor/react";
import { TrashIcon } from "@heroicons/react/outline";
import { Ripple } from "primereact/ripple";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

const img = {
  display: "block",
  width: "auto",
  height: "100%",
};

export function UploadImage() {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    resetFiles,
    files,
    startUpload,
  } = useUploadThing("imageUploader");

  //   useEffect(() => {
  //     if (files.length > 0) {
  //       startUpload();
  //     }
  //   }, [files]);
  //   useEffect(() => {
  //     if (files.length > 0) {
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         setImage(reader.result as string);
  //         reader.onload = null; // Clean up the FileReader
  //       };
  //       reader.readAsDataURL(files[0]);
  //     }
  //   }, [files]);
  console.log("files", files);
  return (
    <div
      {...getRootProps()}
      className="relative flex h-28 w-28 items-center justify-center  rounded-lg border-dashed border-2 p-2"
    >
      <input {...getInputProps()} />
      <div>
        {files.length > 0 && (
          <Image src={files[0].contents} alt="Image" width="80" height="60" />
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
  );
}
