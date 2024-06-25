import React from "react";

const Loader: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 mb-4"></div>
        <p className="text-lg text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
