import React, { useContext } from "react";
import { RouteContext } from "../../App";

const Footer = () => {
  const [current, setRoute, routes] = useContext(RouteContext);

  const NavItem = ({ route }) => {
    const handleClick = () => setRoute(route);

    return (
      <div onClick={handleClick} className="cursor-pointer text-center">
        {route.libelle}
      </div>
    );
  };

  return (
    <footer className="bg-gray-100 py-2 border-t-2 rounded-t-md">
      <nav className="flex justify-evenly">
        {routes.map((route) => (
          <NavItem key={route.id} route={route} />
        ))}
      </nav>
    </footer>
  );
};

export default Footer;
