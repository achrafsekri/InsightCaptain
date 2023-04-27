import React from "react";
import PickOption from "../../components/page/organization/PickOption";
import Logo from "../../shared/Logo";

const index = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50 ">
      <div className="absolute top-6 left-6">
        <Logo />
      </div>
      <PickOption />
    </div>
  );
};

export default index;
