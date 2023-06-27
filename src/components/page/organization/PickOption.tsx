import React from "react";
import { Button } from "primereact/button";
import CreateOrganization from "./CreateOrganization";
import JoinOrganization from "./JoinOrganization";

const PickOption = () => {
  const [step, setStep] = React.useState("pick");
  return (
    <div className=" container h-2/3 max-w-3xl  rounded-lg bg-white shadow-sm ">
      {step === "pick" && (
        <div
          className="flex h-full max-w-3xl items-center justify-center gap-6 "
       
        >
          <Button
            label="Create Organization"
            className="p-button-lg p-button-primary"
            onClick={() => setStep("create")}
          />
          <Button
            label="Join Organization"
            className=" p-button-lg p-button-primary"
            onClick={() => setStep("join")}
          />
        </div>
      )}
      {step == "create" && <CreateOrganization setStep={setStep} />}
      {step == "join" && <JoinOrganization setStep={setStep} />}
    </div>
  );
};

export default PickOption;
