"use client";

import React from "react";
import { useState } from "react";
import Display from "../components/Display";

const test = () => {
    const [count, setCount] = useState(0);
    const increment = () => {
      setCount(count + 1);
    };
    function decrement() {
      setCount(count - 1);
    }
//   let count = 0;
//   const increment = () => {
//     count++;
//   };
//   const decrement = () => {
//     count--;
//   };
  return (
    <div>
      <h1 className="text-4xl">Test</h1>
      <p className="text-2xl">This is a test page</p>
      <div className="flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <button className="text-black" onClick={increment}>
          +
        </button>
        <p className="text-2xl">{count}</p>
        <button className="text-black" onClick={decrement}>
          -
        </button>
        <Display count={count} />
      </div>
    </div>
  );
};

export default test;
