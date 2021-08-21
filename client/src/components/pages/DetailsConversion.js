/* global chrome */
import React, { createContext, useEffect, useState } from "react";

import Spinner from "../common/Spinner";
import Button from "../common/Button";
import MetaData from "./detail/MetaData";
import Cover from "./detail/Cover";
import TimeLine from "./detail/TimeLine";

const TIMEOUT = 300;

export const DetailsContext = createContext({});

const DetailsConversion = () => {
  const [video, setVideo] = useState({});
  const [status, setStatus] = useState("waiting");
  const [loading, setLoading] = useState(false);
  const valuesState = useState({});

  const getInfoFromContentScript = () => {
    if (chrome?.tabs?.query)
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "ask" }, (response) => {
          if (response?.status === "ready") {
            const { videoDetails, videoId } = response;
            setVideo({ id: videoId, ...videoDetails });
            setStatus(response.status);
          } else {
            setStatus(response?.status || "error");
            setTimeout(getInfoFromContentScript, TIMEOUT);
          }
        });
      });
    else {
      const Tabid = ["3PCHyHvLr4M", "0zvN2Vu5HMw", "H6f11oN_gDY"];
      const id = Tabid[Math.floor(Math.random() * Tabid.length)];

      fetch(`http://localhost:7999/info/${id}`)
        .then((res) => res.json())
        .then((json) => {
          setStatus("ready");
          setVideo({ id, ...json.details });
        });
    }
  };

  useEffect(getInfoFromContentScript, []);

  const handleClick = async () => {
    setLoading(true);
    const [values] = valuesState;
    const { id: videoId } = video;

    if (chrome.tabs)
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) =>
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "download2", videoId, params: values },
          (response) => {
            if (response.success) setLoading(false);
          }
        )
      );
    else {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      setLoading(false);
    }
  };

  if (status !== "ready") return <Spinner size={30} />;

  return (
    <DetailsContext.Provider value={valuesState}>
      <div className="p-2">
        <MetaData video={video} />
        <Cover video={video} />
        <TimeLine video={video} />
        <div className="mt-2">
          <Button onClick={handleClick} loading={loading}>
            Convertir
          </Button>
        </div>
      </div>
    </DetailsContext.Provider>
  );
};

export default DetailsConversion;
