import React from "react";
import { Transition } from "@tailwindui/react";
import { FaMinus, FaPlus } from "react-icons/fa";

import { useToggle } from "../../hooks";

const Card = ({ title, children }) => {
  const [open, toggle] = useToggle(true);

  return (
    <div className="border mt-2 rounded-lg shadow-md">
      <div className="px-2 py-1 flex justify-between">
        <h2 className="text-lg">{title}</h2>
        <button
          onClick={toggle}
          className="transition transform hover:text-blue-700 hover:scale-105 duration-150 p-1.5"
        >
          {open ? <FaMinus /> : <FaPlus />}
        </button>
      </div>
      <Transition
        show={open}
        enter="transition transform duration-1000"
        enterFrom="opacity-0 -translate-y-10"
        enterTo="opacity-100 translate-y-0"
        leave="transition-opacity duration-400"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="border-t">{children}</div>
      </Transition>
    </div>
  );
};

export default Card;
