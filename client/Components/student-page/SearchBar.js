import { useState } from "react";

const SearchBar = () => {
  const [term, setTerm] = useState("Mid Term");
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const type = userData?.type;

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-14 items-center justify-between mx-3 space-y-3 md:space-y-0">
      <h3 className="px-5 py-2 text-xl md:text-2xl rounded-md bg-purple-400 font-bold text-white text-center">
        {type === "student"
          ? "Your Enrolled Subjects "
          : "Your Assigned Subjects "}
      </h3>
      <h3 className="px-3 py-2 text-lg md:text-xl rounded-md bg-purple-400 font-bold text-white text-center">
        {term}
      </h3>
    </div>
  );
};

export default SearchBar;
