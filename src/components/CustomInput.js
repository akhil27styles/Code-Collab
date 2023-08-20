import React from "react";

const CustomInput = ({ customInput, setCustomInput }) => {
  return (
    <textarea
      rows="5"
      value={customInput}
      onChange={(e) => setCustomInput(e.target.value)}
      placeholder={`Custom input`}
      className="w-full h-20 px-3 py-2 bg-[#1e293b] text-white font-normal text-sm border border-[#374151] rounded focus:outline-none focus:border-[#60A5FA] resize-none"
    />
  );
};

export default CustomInput;
