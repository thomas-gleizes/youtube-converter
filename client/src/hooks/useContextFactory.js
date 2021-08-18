import React, { useContext } from "react";

const useContextFactory = (context) => {
  return () => {
    const ctx = useContext(context);
    if (ctx === undefined) {
      throw new Error(`useContext must be used withing a ContextProvider.`);
    }
    return ctx;
  };
};

export default useContextFactory;
