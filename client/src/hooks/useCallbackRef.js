import { useState, useCallback } from "react";

const useCallbackRef = (effect) => {
  const [node, setNode] = useState(null);

  const ref = useCallback(
    (node) => {
      console.log("Ici");
      if (node) {
        setNode(node);
        effect && effect(node);
      }
    },
    [node]
  );

  return [node, ref];
};

export default useCallbackRef;
