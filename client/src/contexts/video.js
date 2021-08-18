/* global chrome */
import React, { createContext, useEffect, useState } from "react";

const VideoContext = createContext({});

const VideoContextProvider = ({ children }) => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (chrome?.tabs) {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { message: "info" }, (res) => {
          console.log("response", res);
        });
      });
    } else {
      setDetails(null);
    }
  }, []);

  return <VideoContext.Provider value={{}}>{children}</VideoContext.Provider>;
};

export default VideoContext;
