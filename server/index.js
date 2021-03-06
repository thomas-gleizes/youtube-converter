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

const WAITING = "waiting";
const DOWNLOADING = "downloading";
const READY = "READY";

var status = WAITING;

app.use(
  cors({
    origin: "*",
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(timeout(30000));

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
  fs.appendFile("trace.txt", `${getDate()} => ${message};\n`, () =>
    console.log(`> trace : ${message}`)
  );
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
    console.log("tentative ??chou??");
    trace("Token invalid");
    res.status(401).send();
  }
});

app.get("/", (req, res) => {
  console.log(getDate(), "Request to index");
  res.send({ route: "http://localhost:7999/download/:id", success: true });
});

app.get("/download/:id", async (req, res) => {
  console.log("status", status);

  try {
    let timeout = false;
    const { id } = req.params;

    if (status === DOWNLOADING) {
      res.status(403).send({ status });
      return;
    } else if (status === WAITING) {
      clearTmp();

      status = DOWNLOADING;
      setTimeout(() => {
        console.log("timeout");
        timeout = true;
      }, 30000);

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
        album: info.videoDetails.media.album || "",
        title:
          info.videoDetails.media.song || parseTitle(info.videoDetails.title),
        date: new Date().getFullYear(),
      };

      await downloadCover(info, req.query.cover);
      await setMetadata(MP3, metadata);

      status = READY;
    }

    if (timeout) {
      res.status(503).send();
    } else {
      res.set("Content-Type", "audio/mp3");
      fs.createReadStream(MP3).pipe(res);

      status = WAITING;
    }
  } catch (e) {
    status = WAITING;
    console.log("Error : ", e);
    trace(`Erreure sur download`);

    res.status(500).send("une erreur est survenue.");
  }

  console.log("fin Status", status);
});

app.get("/download", async (req, res) => {
  if (status === DOWNLOADING) {
    res.status(403).send({ status });
  } else if (status === READY) {
    res.set("Content-Type", "audio/mp3");
    fs.createReadStream(MP3).pipe(res);
  } else if (status === WAITING) {
    res.status(404).send({ status });
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

app.get("/trace", (req, res) => {
  res.set("Content-Type", "text/txt");
  res.set("Content-Disposition", `attachment; filename="trace"`);
  fs.createReadStream("trace.txt").pipe(res);
});

app.listen(process.env.PORT, async () => {
  await createTrace();
  trace(`Server start on port : ${process.env.PORT}`);

  console.log(
    `============= server start at : ${getDate()}, on Port : ${
      process.env.PORT
    } =============`
  );
});
