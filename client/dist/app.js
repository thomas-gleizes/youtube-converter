const parseTitle = (title) => {
  return title.replace("(lyrics)", "").replace("(Lyrics)", "");
};

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  try {
    const headers = { authorization: "token" };

    const { videoId } = request;
    const { title, file } = await fetch(
      `https://yt-kt-converter.herokuapp.com/download/${videoId}`,
      { headers }
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
