import PropTypes from "prop-types";

const ListItem = ({ title, children, ...rest }) => {
  return (
    <li {...rest}>
      <span className="font-semibold text-gray-800">{title} : </span>
      {children}
    </li>
  );
};
ListItem.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  rest: PropTypes.element,
};

export default ListItem;
