const parseTitle = (title) => {
  return title.replace("(lyrics)", "").replace("(Lyrics)", "");
};

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  try {
    const { videoId } = request;
    const { title, file } = await fetch(
      `http://localhost:8080/download/${videoId}`
    ).then((res) => res.json());

    const anchor = document.createElement("a");
    anchor.download = parseTitle(title) + ".mp3";
    anchor.href = `data:audio/mp3;base64,${file}`;
    anchor.click();

    sendResponse({ success: true });
  } catch (e) {
    console.log("ERROR : ", e.message);
    sendResponse({ success: false });
  }
});
