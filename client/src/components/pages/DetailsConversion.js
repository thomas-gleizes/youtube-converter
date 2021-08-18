/* global chrome */
import React, { useEffect, useState } from "react";

const TIMEOUT = 100;

const DetailsConversion = () => {
  const [video, setVideo] = useState({});
  const [status, setStatus] = useState(false);

  const getInfoFromContentScript = () => {
    console.log("ask envoyé");
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
  };

  useEffect(getInfoFromContentScript, []);

  console.log("video", video);

  return (
    <div>
      <div>{video?.title ? video.title : "Aucune information"}</div>
    </div>
  );
};

export default DetailsConversion;
