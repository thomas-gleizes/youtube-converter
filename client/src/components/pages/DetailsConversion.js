/* global chrome */
import React, { useEffect, useState } from "react";

import Spinner from "../common/Spinner";
import Button from "../common/Button";
import MetaData from "./detail/MetaData";
import Cover from "./detail/Cover";
import TimeLine from "./detail/TimeLine";

const TIMEOUT = 300;

const DetailsConversion = () => {
  const [video, setVideo] = useState({});
  const [status, setStatus] = useState("waiting");

  const getInfoFromContentScript = () => {
    if (chrome?.tabs?.query) {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "ask" }, (response) => {
          console.log("response", response);
          setStatus(response.status || "ERROR");
          if (response?.status === "ready") {
            const { videoDetails, videoId } = response;
            setVideo({ id: videoId, ...videoDetails });
          } else {
            console.log("retry : ", response?.status);
            setTimeout(getInfoFromContentScript, TIMEOUT);
          }
        });
      });
    } else {
      const Tabid = [
        "PMsksbchdDg",
        "pOMXOyJRzIc",
        "BJ8XPi-cPkM",
        "WUTiZ82Gxsg",
        "18JQUYgpOlw",
        "DpCfhRVqJWU",
      ];

      fetch(
        "http://localhost:7999/info/" +
          Tabid[Math.floor(Math.random() * Tabid.length)]
      )
        .then((res) => res.json())
        .then((json) => {
          setStatus("ready");
          setVideo({ id: "0c3_3cAo2lE", ...json.details });
        });
    }
  };

  useEffect(getInfoFromContentScript, []);

  if (status !== "ready") return <Spinner size={30} />;

  return (
    <div className="p-2">
      <MetaData video={video} />
      <Cover video={video} />
      <TimeLine video={video} />
      <div className="mt-2">
        <Button loading={false} color="blue">
          Convertir
        </Button>
      </div>
    </div>
  );
};

export default DetailsConversion;
