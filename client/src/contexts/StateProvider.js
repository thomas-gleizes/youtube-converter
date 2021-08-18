import React, { createContext, useState } from "react";
import { useContextFactory } from "../hooks";

const StateContext = createContext({});

export const useStateContext = useContextFactory(StateContext);

const StateProvider = ({ children }) => {
  const [state, setState] = useState({});

  return (
    <StateContext.Provider value={[state, setState]}>
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
