const express = require("express");
const bodyParser = require("body-parser");
const timeout = require("connect-timeout");
const cors = require("cors");
const dotenv = require("dotenv");
const moment = require("moment");
const fs = require("fs");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const ffmetadata = require("ffmetadata");
const fetch = require("node-fetch");

dotenv.config();
const app = express();

const MP3 = "./tmp/file.mp3";
const WEBP = "./tmp/file.webp";
const JPG = "./tmp/file.jpg";

app.use(
  cors({
    origin: "*",
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(timeout(1000 * 30));

const getDate = () => moment().format("YYYY-MM-DD HH:mm:ss");

const createTrace = () => {
  return new Promise((resolve) =>
    fs.exists("trace.txt", (exists) => {
      if (!exists)
        fs.open("trace.txt", "w", () =>
          fs.writeFile("trace.txt", `Trace start ${getDate()} \n\r`, resolve)
        );
      else resolve();
    })
  );
};

const trace = (message) => {
  return new Promise((resolve) => {
    fs.appendFile("trace.txt", `${getDate()} => ${message};\n`, resolve);
  });
};

const parseTitle = (title) => {
  ["(lyrics)", "(Lyrics)"].forEach((word) => {
    title?.replace(word, "");
  });
  return title?.replace(/[^a-zA-Z ]/g, "");
};

const downloadCover = (info, index = null) => {
  return new Promise(async (resolve, reject) => {
    const {
      videoDetails: { thumbnails },
    } = info;
    if (!index) index = thumbnails.length - 1;
    const media = thumbnails[index];
    const buffer = await fetch(media.url).then((response) => response.buffer());
    fs.writeFile(WEBP, buffer, (err) => {
      if (err) reject(err);
      else {
        ffmpeg({ source: WEBP })
          .output(JPG)
          .on("end", resolve)
          .on("error", reject)
          .run();
      }
    });
  });
};

const setMetadata = (source, metadata) => {
  const options = {
    attachments: [JPG],
  };

  return new Promise((resolve, reject) => {
    ffmetadata.write(source, { ...metadata }, options, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

const clearTmp = () => {
  fs.unlink(MP3, () => {});
  fs.unlink(WEBP, () => {});
  fs.unlink(JPG, () => {});
};

app.get("*", (req, res, next) => {
  if (
    process.env.NODE_ENV === "dev" ||
    req.headers.authorization === process.env.TOKEN
  ) {
    next();
  } else {
    console.log("tentative échoué");
    trace("Token invalid");
    res.status(401).send();
  }
});

app.get("/", (req, res) => {
  console.log(getDate(), "Request to index");
  res.send({ route: "http://localhost:7999/download/:id", success: true });
});

let status = false;

app.get("/download/:id", async (req, res) => {
  try {
    console.log("Status : ", status);
    while (status) {
      console.log("waiting : ", status);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    status = true;
    const { id } = req.params;
    console.log(getDate(), "download : ", id);
    trace(`Download : ${id}`);

    const url = `https://www.youtube.com/watch?v=${id}`;
    const info = await ytdl.getInfo(url, { quality: "highestaudio" });
    const videoLength = parseInt(info.videoDetails.lengthSeconds);

    const begin = parseInt(req.query.begin);
    const end = parseInt(req.query.end);

    let firstoptions,
      secondoptions = "";
    let length;

    if (begin && end) {
      firstoptions = `-ss ${begin}`;
      secondoptions = `-t ${end - begin}`;
      length = end - begin;
    } else if (begin) {
      firstoptions = `-ss ${begin}`;
      secondoptions = `-t ${videoLength}`;
      length = videoLength - begin;
    } else if (end) {
      firstoptions = "-ss 0";
      secondoptions = `-t ${end}`;
      length = end;
    } else {
      firstoptions = "-ss 0";
      secondoptions = `-t ${videoLength}`;
      length = videoLength;
    }

    if (length > process.env.MAX_LENGTH)
      throw new Error("la video est trop longue");

    await new Promise((resolve, reject) =>
      ffmpeg(
        ytdl.downloadFromInfo(info, {
          quality: "highestaudio",
        })
      )
        .audioBitrate(info.formats[0].audioBitrate)
        .withAudioCodec("libmp3lame")
        .toFormat("mp3")
        .inputOptions(firstoptions)
        .inputOptions(secondoptions)
        .saveToFile(MP3)
        .on("progress", (progress) =>
          console.log("progress : ", progress.timemark)
        )
        .on("error", reject)
        .on("end", resolve)
    );

    const metadata = {
      artist: info.videoDetails.media.artist || info.videoDetails.author.name,
      title:
        info.videoDetails.media.song || parseTitle(info.videoDetails.title),
      date: new Date().getFullYear(),
    };

    await downloadCover(info, req.query.cover);
    await setMetadata(MP3, metadata);

    res.set("Content-Type", "audio/mp3");
    res.set(
      "Content-Disposition",
      `attachment; filename="${
        parseTitle(info.videoDetails.media.song) ||
        parseTitle(info.videoDetails.title)
      }"`
    );

    const audioStream = fs.createReadStream(MP3);
    audioStream.pipe(res);
    clearTmp();
    status = false;
    console.log("END : " + metadata.title);
  } catch (e) {
    console.log("Error : ", e);
    res.status(500).send("une erreur est survenue.");
  }
});

app.get("/info/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log(getDate(), "info :", id);
    trace(`Info : ${id}`);

    const url = `https://www.youtube.com/watch?v=${id}`;
    const { videoDetails } = await ytdl.getInfo(url);
    res.send({ success: true, details: videoDetails });
  } catch (e) {
    res.status(400).send();
  }
});

app.listen(process.env.PORT || 8080, async () => {
  await createTrace();
  trace(`Server start on port : ${process.env.PORT}`);

  console.log(
    `============= server start at : ${getDate()}, on Port : ${
      process.env.PORT || 8080
    } =============`
  );
});
