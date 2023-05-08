import { Card, Text } from "@tremor/react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import React from "react";
import EditTextField from "./EditTextField";

const TextField = () => {
  const [edit, setEdit] = React.useState<boolean>(false);
  return (
    <>
      {!edit && (
        <>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              icon="pi pi-pencil"
              rounded
              text
              aria-label="Filter"
              onClick={() => setEdit(true)}
            />
          </div>
          <Text className="mt-4 text-lg font-bold text-gray-800">
            How do you like your shawarma?
          </Text>
          <Text className="text-sm mb-4">
            Pizza is eaten different accross multiple people How do you like
            your pizza?{" "}
          </Text>
          <InputTextarea
            autoResize
            onChange={(e) => console.log(e.target.value)}
            rows={5}
            cols={30}
            className="w-full "
          />
        </>
      )}
      {edit && <EditTextField setEdit={setEdit} />}
    </>
  );
};

export default TextField;
