import { useState, useCallback } from "react";

const useCallbackRef = (effect) => {
  const [node, setNode] = useState(null);

  const ref = useCallback(
    (e) => {
      if (e && JSON.stringify(e) !== JSON.stringify(node)) {
        setNode(e);
        effect && effect(e);
      }
    },
    [node] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return [node, ref];
};

export default useCallbackRef;
