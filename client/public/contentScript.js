/* global chrome */
const READY = "ready";
const LOADING = "loading";
const WAITING = "waiting";
const ERROR = "error";
const NULL = "null";

const API_URL = "http://localhost:7999";
const HEADERS = { authorization: "" };
const BAN_WORDS = ["(lyrics)", "(Lyrics)"];

let videoId = null;
let videoDetails = null;
let status = WAITING;

function fetchApi(path, options) {
  return fetch(API_URL + path, { HEADERS, ...options });
}

function parseTitle(title) {
  BAN_WORDS.forEach((word) => {
    title.replace(word, "");
  });
  return title;
}

const initialize = async (url) => {
  try {
    const { hostname, pathname, searchParams } = new URL(url);

    if (
      hostname === "www.youtube.com" &&
      pathname === "/watch" &&
      searchParams.get("v")
    ) {
      videoId = searchParams.get("v");
      status = LOADING;

      const json = await fetchApi(`/info/${videoId}`).then((response) =>
        response.json()
      );

      videoDetails = json.details;
      status = READY;
    } else {
      status = NULL;
      videoId = null;
    }
  } catch (e) {
    status = ERROR;
  }
};

const download = async (videoId) => {
  const response = await fetchApi(`/download/${videoId}`);
  const blob = await response.blob();
  const filename = response.headers.get("Content-Disposition").split('"')[1];

  const anchor = document.createElement("a");
  anchor.download = `${parseTitle(filename)}.mp3`;
  anchor.href = URL.createObjectURL(blob);
  anchor.click();
};

const downloadWithParams = async (videoId, options) => {
  console.log("options", options);

  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log("end");
  /*
  const params = {};

  const response = await fetchApi(`/download2/${videoId}`, { params });
  const blob = await response.blob();
  const filename = response.headers.get("Content-Disposition").split('"')[1];

  const anchor = document.createElement("a");
  anchor.download = `${parseTitle(filename)}.mp3`;
  anchor.href = URL.createObjectURL(blob);
  anchor.click();

   */
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    console.log("request", request);
    const { action } = request;

    if (action === "info") {
      initialize(request.url).then(() =>
        sendResponse({ status, videoDetails })
      );
    } else if (action === "download") {
      download(request.videoId).then(() => sendResponse({ success: true }));
    } else if (action === "download2") {
      downloadWithParams(request.videoId, request.params).then(() =>
        sendResponse({ success: true })
      );
    } else if (action === "ask") {
      sendResponse({ videoDetails, videoId, status });
    } else {
      console.log("no action");
    }
  } catch (e) {
    console.log("ERROR : ", e);
  }
  return true;
});

initialize(document.location.href)
  .then(() => console.log("Initialize : success"))
  .catch((e) => console.log("Initialize : error => ", e));
