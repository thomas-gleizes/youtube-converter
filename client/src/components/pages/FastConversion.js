/* global chrome */
import React, { useEffect, useState } from "react";

import Button from "../common/Button";

const FastConversion = () => {
  const [url, setUrl] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (chrome.tabs) {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        setUrl(new URL(tabs[0].url));
      });
    } else setUrl(new URL("https://www.youtube.com/watch?v=q783rNIwc70"));
  }, []);

  useEffect(() => {
    if (url) {
      const { hostname, searchParams, pathname } = url;

      if (
        hostname === "www.youtube.com" &&
        pathname === "/watch" &&
        searchParams.get("v")
      )
        setVideoId(searchParams.get("v"));
      else setVideoId(null);
    } else setVideoId(null);
  }, [url]);

  const handleClick = async () => {
    setLoading(true);
    console.log("id", videoId);
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(
        activeTab.id,
        { action: "download", videoId },
        (response) => {
          if (response.success) {
            setLoading(false);
          }
        }
      );
    });
  };

  return (
    <div className="w-full py-2">
      <div className="mb-3 mx-2 text-md">
        VideoId : <span>{videoId || "aucun"}</span>
      </div>
      <div className="text-center mx-3">
        {videoId ? (
          <Button loading={loading} onClick={handleClick} color="blue">
            Convertir
          </Button>
        ) : (
          <div>Aucune video détecter</div>
        )}
      </div>
    </div>
  );
};

export default FastConversion;
