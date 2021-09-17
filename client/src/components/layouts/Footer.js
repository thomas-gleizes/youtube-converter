import React, { useContext } from "react";
import { RouteContext } from "../../App";

const Footer = () => {
  const [current, setRoute, routes] = useContext(RouteContext);

  const NavItem = ({ route }) => {
    const handleClick = () => setRoute(route);

    return (
      <div
        onClick={handleClick}
        className={`cursor-pointer text-center ${current === route && "border-b-2 border-white"}`}
      >
        {route.libelle}
      </div>
    );
  };

  return (
    <footer className="bg-gradient-to-bl from-blue-900 to-gray-900 text-white py-2 rounded-t-md">
      <nav className="flex justify-evenly">
        {routes.map((route) => (
          <NavItem key={route.id} route={route} />
        ))}
      </nav>
    </footer>
  );
};

export default Footer;
