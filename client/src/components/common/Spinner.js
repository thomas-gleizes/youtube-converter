import React from "react";
import PropTypes from "prop-types";
import { FaSpinner } from "react-icons/fa";

const Spinner = ({ size, className }) => {
  return (
    <FaSpinner
      size={size}
      className={`animate-spin mx-auto my-2 ${className}`}
    />
  );
};

Spinner.prototype = {
  size: PropTypes.number,
};

Spinner.defaultProps = {
  size: 20,
  className: "",
};

export default Spinner;
