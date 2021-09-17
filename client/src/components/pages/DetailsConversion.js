/* global chrome */
import React, { createContext, useEffect, useState } from "react";

import { useToggle } from "../../hooks";
import Spinner from "../common/Spinner";
import Button from "../common/Button";
import MetaData from "./detail/MetaData";
import Cover from "./detail/Cover";
import TimeLine from "./detail/TimeLine";

const READY = "ready";
const LOADING = "loading";
const WAITING = "waiting";
const ERROR = "error";
const NULL = "null";

const TIMEOUT = 300;

export const DetailsContext = createContext({});

const DetailsConversion = () => {
  const [video, setVideo] = useState({});
  const [status, setStatus] = useState(WAITING);
  const [loading, setLoading] = useState(false);
  const valuesState = useState({});

  const [_, toggle] = useToggle();

  const getInfoFromContentScript = () => {
    if (chrome?.tabs?.query)
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        const { hostname, pathname, searchParams } = new URL(tabs[0].url);
        if (hostname === "www.youtube.com" && pathname === "/watch" && searchParams.get("v"))
          chrome.tabs.sendMessage(tabs[0].id, { action: "ask" }, (response) => {
            const status = response?.status;

            if (status === READY) {
              const { videoDetails, videoId } = response;
              setVideo({ id: videoId, ...videoDetails });
              setStatus(response.status);
            } else if (status === ERROR || status === NULL) setStatus(response.status);
            else setTimeout(getInfoFromContentScript, TIMEOUT);
          });
        else setStatus(NULL);
      });
    else {
      fetch("http://localhost:8000/info/SnG4tNibrkY")
        .then((response) => response.json())
        .then((json) => {
          setStatus(READY);
          setVideo({ id: "0zvN2Vu5HMw", ...json.details });
        });
    }
  };

  useEffect(getInfoFromContentScript, [_]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = async () => {
    setLoading(true);
    const [values] = valuesState;
    const { id: videoId } = video;

    if (chrome.tabs)
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) =>
        chrome.tabs.sendMessage(tabs[0].id, { action: "download2", videoId, params: values }, (response) => {
          if (response.success) setLoading(false);
        })
      );
    else {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      setLoading(false);
    }
  };

  const handleReload = () => {
    if (chrome?.tabs)
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) =>
        chrome.tabs.sendMessage(tabs[0].id, { action: "reload" })
      );
    setStatus(WAITING);
    setTimeout(toggle, 3000);
  };

  return (
    <>
      {status === READY ? (
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
      ) : status === LOADING || status === WAITING ? (
        <Spinner size={30} className="my-4 text-blue-600" />
      ) : status === NULL ? (
        <div>
          <h2 className="text-lg text-yellow-500 text-center my-2 font-semibold">Aucun video détecter</h2>
        </div>
      ) : status === ERROR ? (
        <div>
          <h2 className="text-lg text-red-500 text-center my-2 font-semibold">Une erreur est survenue</h2>
          <div className="w-10/12 mx-auto my-2">
            <button
              onClick={handleReload}
              className="rounded text-white text-center text-lg w-full py-1 bg-gradient-to-br from-yellow-600 to-yellow-400 shadow hover:shadow-xl transform transition duration-75 hover:scale-105"
            >
              Recharger
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default DetailsConversion;
