import React from "react";
import PropTypes from "prop-types";
import { Transition } from "@tailwindui/react";
import { FaMinus, FaPlus } from "react-icons/fa";

import { useToggle } from "../../hooks";

const Card = ({ innerRef, title, children, defaultOpen }) => {
  const [open, toggle] = useToggle(defaultOpen);

  return (
    <div
      ref={innerRef}
      data-open={open}
      className="border mb-2 rounded-lg shadow-md"
    >
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
        <div className="border-t bg-white">{children}</div>
      </Transition>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  defaultOpen: PropTypes.bool,
};

Card.defaultProps = {
  defaultOpen: true,
};

export default React.forwardRef(Card);
