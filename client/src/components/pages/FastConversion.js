/* global chrome */
import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

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
      chrome.tabs.sendMessage(activeTab.id, { videoId }, (response) => {
        console.log("response", response);
      });
    });
  };

  return (
    <div className="p-2">
      <div className="mb-3 text-md">
        VideoId : <span>{videoId || "aucun"}</span>
      </div>
      <div>
        {videoId ? (
          <>
            {!loading ? (
              <button
                onClick={handleClick}
                className="bg-gradient-to-bl from-blue-600 to-blue-900 rounded text-white shadow hover:shadow-xl transform transition duration-75 hover:scale-105 text-lg px-4 py-1"
              >
                Convertir
              </button>
            ) : (
              <button
                disabled={true}
                className="bg-gray-400 rounded font-semibold px-4 py-1 text-lg flex justify-center text-white rounded opacity-75 flex"
              >
                chargement{" "}
                <i className="my-auto ml-3">
                  <FaSpinner size={20} className="animate-spin" />
                </i>
              </button>
            )}
          </>
        ) : (
          <div>Aucune video détecter</div>
        )}
      </div>
    </div>
  );
};

export default FastConversion;
