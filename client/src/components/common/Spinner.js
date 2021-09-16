import React from "react";
import PropTypes from "prop-types";
import { FaSpinner } from "react-icons/fa";

const Spinner = ({ size, className }) => {
  return (
    <FaSpinner size={size} className={`animate-spin mx-auto ${className}`} />
  );
};

Spinner.prototype = {
  size: PropTypes.number,
  className: PropTypes.string,
};

Spinner.defaultProps = {
  size: 20,
  className: "my-4",
};

export default Spinner;
