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

app.get("*", (req, res, next) => {
  if (
    process.env.NODE_ENV === "dev" ||
    req.headers.authorization === process.env.TOKEN
  ) {
    next();
  } else {
    console.log("tentative échoué");
    res.status(401).send();
  }
});

const MP3 = "./tmp/file.mp3";
const MP4 = "./tmp/file.mp4";
const WEBP = "./tmp/file.webp";
const JPG = "./tmp/file.jpg";

const getDate = () => moment().format("YYYY-MM-DD HH:mm:ss");

const downloadVideo = (url, dest) => {
  return new Promise((resolve, reject) => {
    const stream = ytdl(url, {
      quality: "highestaudio",
      filter: (format) => format.container === "mp4",
    })
      .on("progress", (_, dl, total) => {
        const percent = parseInt(parseFloat(dl / total) * 100);
        console.log(`Download : ${dl} / ${total} => ${percent}%`);
      })
      .on("error", (err) => {
        console.log("Download error : ", err);
        reject(err);
      })
      .on("end", () => {
        console.log("Download : FINISH");
        resolve(stream);
      })
      .pipe(fs.createWriteStream(dest));
  });
};

const convertToMp3 = (source, dest) => {
  console.log("convert");
  return new Promise((resolve, reject) => {
    ffmpeg({ source })
      .output(dest)
      .audioBitrate("192k")
      .on("end", () => {
        console.log("Convert : FINISH");
        resolve();
      })
      .on("error", (err) => {
        console.log("convert error : ", err);
        reject(err);
      })
      .run();
  });
};

const downloadCover = (info) => {
  console.log("cover");
  return new Promise(async (resolve, reject) => {
    const {
      videoDetails: { thumbnails },
    } = info;
    const media = thumbnails[thumbnails.length - 1];

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

const setMetadata = (source, { videoDetails }) => {
  const metadata = {
    title: videoDetails.title.replace("(lyrics)", "").replace("(Lyrics)", ""),
    author: videoDetails.author.name,
  };

  console.log("metadata : ", metadata);

  const options = {
    attachments: [JPG],
  };

  return new Promise((resolve, reject) => {
    ffmetadata.write(source, metadata, options, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

const clearTmp = () => {
  fs.unlink(MP3, () => {});
  fs.unlink(MP4, () => {});
  fs.unlink(WEBP, () => {});
  fs.unlink(JPG, () => {});
};

app.get("/", (req, res) => {
  console.log("request to index");

  res.send({ route: "http://localhost:7999/download/:id", success: true });
});

app.get("/download/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(getDate(), `received : ${id}`);

    const url = `https://www.youtube.com/watch?v=${id}`;
    const info = await ytdl.getInfo(url);

    if (info.videoDetails.lengthSeconds > 480)
      throw new Error("the video is to big");

    await downloadVideo(url, MP4);
    await convertToMp3(MP4, MP3);
    await downloadCover(info);
    await setMetadata(MP3, info);

    const stream = fs.createReadStream(MP3);
    clearTmp();

    res.set("Content-Type", "audio/mp3");
    res.set(
      "Content-Disposition",
      `attachment; filename="${info.videoDetails.title}"`
    );

    console.log("script : finish");
    stream.pipe(res);
  } catch (e) {
    console.log("error", e);
    res.status(400).send({ error: e.message });
  }
});

app.get("/info/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log(getDate(), "info :", id);
    const url = `https://www.youtube.com/watch?v=${id}`;
    const { videoDetails } = await ytdl.getInfo(url);
    res.send({ success: true, details: videoDetails });
  } catch (e) {
    res.status(400);
  }
});

app.get("/headers", async (req, res) => {
  const stream = fs.createReadStream("./tmp/test.mp3");

  res.set("Content-Type", "audio/mp3");
  res.set("Content-Disposition", `attachment; filename="ceci est un test"`);

  stream.pipe(res);
});

app.listen(process.env.PORT || 8080, () => {
  console.log(
    `============= server start at : ${getDate()}, on Port : ${
      process.env.PORT || 8080
    } =============`
  );
});
