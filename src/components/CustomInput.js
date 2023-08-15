import React from "react";
import { classnames } from "../utils/general";
const CustomInput = ({ customInput, setCustomInput }) => {
  return (
    <>
      {" "}
      <textarea
        rows="5"
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        placeholder={`Custom input`}
        className="w-full h-20 bg-[#1e293b] rounded-md text-white font-normal text-sm overflow-y-auto"
      ></textarea>
    </>
  );
};

export default CustomInput;
