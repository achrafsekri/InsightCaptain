import React from "react";
import { useEffect } from "react";

const Display = ({ count }) => {
  useEffect(() => {
    console.log("updated");
  }, [count]);

  return (
    <div>
      <p className="text-2xl bg-black">{count}</p>
    </div>
  );
};

export default Display;
