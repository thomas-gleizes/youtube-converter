/* global chrome */
const READY = "ready";
const LOADING = "loading";
const WAITING = "waiting";
const DOWNLOADING = "downloading";
const ERROR = "error";
const NULL = "null";

const API_URL = "http://localhost:8000";
const HEADERS = { authorization: "" };

let videoId = null;
let videoDetails = null;
let status = WAITING;

function fetchApi(path, options) {
  const url = new URL(`${API_URL}/${path}`);
  if (options?.params)
    Object.keys(options.params).forEach((key) => url.searchParams.append(key, options.params[key]));

  return fetch(url.href, { headers: HEADERS, method: "GET" });
}

const parseTitle = (title) => {
  ["(lyrics)", "(Lyrics)"].forEach((word) => {
    title?.replace(word, "");
  });
  return title?.replace(/[^a-zA-Z ]/g, "");
};

const getInfo = async (url) => {
  try {
    const { hostname, pathname, searchParams } = new URL(url);

    if (hostname === "www.youtube.com" && pathname === "/watch" && searchParams.get("v")) {
      videoId = searchParams.get("v");
      status = LOADING;

      const json = await fetchApi(`info/${videoId}`).then((response) => response.json());

      console.log("JSON", json);

      videoDetails = json.details;
      status = READY;
    } else {
      status = NULL;
      videoId = null;
    }
  } catch (err) {
    console.log("INFO error : ", err);
    status = ERROR;
    throw err;
  }
};

const download = async (videoId, params) => {
  let finish = false;
  status = DOWNLOADING;

  while (!finish) {
    const response = await fetchApi(`download/${videoId}`, { params });

    if (response.status === 200) {
      const blob = await response.blob();

      const anchor = document.createElement("a");
      anchor.download = `${parseTitle(videoDetails.title)}.mp3`;
      anchor.href = URL.createObjectURL(blob);
      anchor.click();

      finish = true;
    } else {
      console.log("sleep");
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }

  status = READY;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    console.log("request", request);
    const { action } = request;

    if (action === "info") {
      getInfo(request.url).then(() => sendResponse({ status, videoDetails }));
    } else if (action === "download") {
      download(request.videoId).then(() => sendResponse({ success: true }));
    } else if (action === "download2") {
      download(request.videoId, request.params).then(() => sendResponse({ success: true }));
    } else if (action === "ask") {
      sendResponse({ videoDetails, videoId, status });
    } else if (action === "reload") {
      status = WAITING;
      getInfo(document.location.href);
    } else {
      console.log("no action");
    }
  } catch (e) {
    console.log("ERROR : ", e);
  }
  return true;
});

getInfo(document.location.href)
  .then(() => console.log("Initialize : success"))
  .catch((e) => console.log("Initialize : error => ", e));
