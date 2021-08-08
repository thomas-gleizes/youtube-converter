/* global chrome */
import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const App = () => {
  const [url, setUrl] = useState();
  const [active, setActive] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      setUrl(new URL(tabs[0].url));
    });
  }, []);

  useEffect(() => {
    if (url) {
      const { host, pathname, searchParams } = url;

      const bool =
        host === "www.youtube.com" &&
        pathname === "/watch" &&
        searchParams.get("v") !== null;

      setActive(bool);
      if (bool) {
        setVideoId(searchParams.get("v"));
      } else {
        setVideoId("");
      }
    } else {
      setActive(false);
    }
  }, [url]);

  const handleClick = async () => {
    setLoading(true);
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { videoId });
    });
  };

  return (
    <div className="p-3">
      <h1 className="mx-auto text-xl font-semibold text-blue-700">
        Youtube-converter
      </h1>

      <div>
        <h2>Video Id : {videoId}</h2>
      </div>

      <div className="flex justify-center w-full mt-4">
        {active ? (
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
          <h3 className="opacity-50 text-black px-2 py-0.5 bg-gray-400">
            Aucune video détecter
          </h3>
        )}
      </div>
    </div>
  );
};

export default App;
