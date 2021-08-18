const READY = "ready";
const LOADING = "loading";
const WAITING = "waiting";
const ERROR = "error";
const NULL = "null";

const API_URL = "http://localhost:7999";
const HEADERS = { authorization: "" };

const BAN_WORDS = ["(lyrics)", "(Lyrics)"];

var videoId = null;
var videoDetails = null;
var status = WAITING;

function fetchApi(path, options) {
  return fetch(API_URL + path, { HEADERS, ...options });
}

function parseTitle(title) {
  BAN_WORDS.forEach((word) => {
    title.replace(word, "");
  });
  return title;
}

const initialize = async () => {
  try {
    const { hostname, pathname, searchParams } = new URL(
      document.location.href
    );

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

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  try {
    console.log("request", request);
    console.log("videoDetails", videoDetails);

    if (request.message === "info") {
    } else if (request.videoId) {
      const response = await fetchApi(`/download/${request.videoId}`);
      const blob = await response.blob();

      const filename = response.headers
        .get("Content-Disposition")
        .split('"')[1];

      const anchor = document.createElement("a");
      anchor.download = `${parseTitle(filename)}.mp3`;
      anchor.href = URL.createObjectURL(blob);
      anchor.click();

      sendResponse({ message: "salut" });
    }
  } catch (e) {
    console.log("ERROR : ", e);
    sendResponse({ success: false });
  }
});

initialize()
  .then(() => console.log("Initialize : success"))
  .catch((e) => console.log("Initialize : error => ", e));
