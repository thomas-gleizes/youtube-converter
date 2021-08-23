import { useEffect, useState } from "react";

const useFetch = (url, options = {}, deps = [], condition = true) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isCrash, setIsCrash] = useState(false);

  useEffect(() => {
    if (condition) {
      (async () => {
        setLoading(true);
        try {
          const json = await fetch(url, options).then((response) =>
            response.json()
          );

          setData(json);
          setIsCrash(false);
        } catch (e) {
          setIsCrash(true);
        }
        setLoading(false);
      })();
    }
  }, [...deps]);

  return [data, loading, isCrash];
};

export default useFetch;
