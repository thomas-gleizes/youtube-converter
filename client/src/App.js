import React, { createContext, useMemo, useState } from "react";

import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import FastConversion from "./components/pages/FastConversion";
import DetailsConversion from "./components/pages/DetailsConversion";

export const RouteContext = createContext({});

const routes = [
  {
    id: 0,
    libelle: "Rapide",
    Component: FastConversion,
  },
  {
    id: 1,
    libelle: "Detailer",
    Component: DetailsConversion,
  },
];

const App = () => {
  const [route, setRoute] = useState(routes[1]);

  const Component = useMemo(() => route.Component, [route]);

  return (
    <RouteContext.Provider value={[route, setRoute, routes]}>
      <div style={{ maxWidth: "330px", width: "100%" }} className="bg-white">
        <Header />
        <main>
          <Component />
        </main>
        <Footer />
      </div>
    </RouteContext.Provider>
  );
};

export default App;
