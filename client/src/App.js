/* global chrome */
import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";

const API_URL = process.env.REACT_APP_API_URL;

const App = () => {
  const [url, setUrl] = useState();
  const [active, setActive] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      setUrl(new URL(tabs[0].url));
    });
  }, []);

  useEffect(() => {
    if (url) {
      const { host, pathname, search } = url;

      const bool = host === "www.youtube.com" && pathname === "/watch";
      setActive(bool);
      if (bool) {
        setVideoId(search.split("=")[1]);
      } else {
        setVideoId("");
      }
    } else {
      setActive(false);
    }
  }, [url]);

  const handleClick = async () => {
    setLoading(true);
    try {
      const { file, title } = await fetch(`${API_URL}/download/${videoId}`)
        .then((response) => response.json())
        .catch((error) => {
          throw error;
        });
      await fetch(`data:audio/mp3;base64,${file}`)
        .then((response) => response.blob())
        .then((blob) => saveAs(blob, `${title}.mp3`));

      setError(false);
    } catch (e) {
      setError(true);
    }
    setLoading(true);
  };

  return (
    <div className="p-3">
      <h1 className="mx-auto text-xl font-semibold text-blue-700">
        Youtube-converter
      </h1>

      <div>
        <h2>Video Id : {videoId}</h2>
        {error && (
          <h3 className="text-red-600 font-bold text-center">
            Une erreur est survenue
          </h3>
        )}
      </div>

      <div className="mx-auto text-center mt-3">
        {active ? (
          <button
            onClick={handleClick}
            className="bg-gradient-to-bl from-blue-600 to-blue-900 rounded text-white shadow hover:shadow-xl transform transition duration-75 hover:scale-105 text-lg px-4 py-1"
          >
            Convertir
          </button>
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
