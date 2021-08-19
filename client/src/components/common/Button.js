import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { FaSpinner } from "react-icons/fa";

const Button = ({ color, loading, onClick, children, ...rest }) => {
  const className = useMemo(() => {
    if (loading) return `bg-gradient-to-bl from-gray-300 to-gray-400 shadow`;
    else
      return `bg-gradient-to-bl from-${color}-600 to-${color}-900 shadow hover:shadow-xl transform transition duration-75 hover:scale-105`;
  }, [color, loading]);

  return (
    <button
      {...rest}
      onClick={onClick}
      disabled={loading}
      className={`${className} rounded text-white text-center text-lg w-full py-1`}
    >
      {loading ? (
        <span className="flex justify-center w-full">
          Chargement
          <i className="my-auto ml-3">
            <FaSpinner size={20} className="animate-spin" />
          </i>
        </span>
      ) : (
        <>{children}</>
      )}
    </button>
  );
};

Button.propTypes = {
  color: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  color: "blue",
  loading: false,
};

export default Button;
