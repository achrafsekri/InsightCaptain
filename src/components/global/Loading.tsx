import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";

const Loading = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <ProgressSpinner />
    </div>
  );
};

export default Loading;
