const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const moment = require("moment");
const fs = require("fs");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const ffmetadata = require("ffmetadata");
const fetch = require("node-fetch");
const { exec } = require("child_process");

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
      .on("progress", ({ percent }) => {
        console.log(`Convert : ${percent.toFixed(1)}%`);
      })
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
    const { videoDetails } = info;
    const media = videoDetails.thumbnails[videoDetails.thumbnails.length - 1];

    const buffer = await fetch(media.url).then((response) => response.buffer());
    fs.writeFile("./tmp/file.webp", buffer, (err) => {
      if (err) reject(err);
      else {
        exec("ffmpeg -i tmp/file.webp tmp/file.jpg", (err, out) => {
          if (err) reject(err);
          else resolve();
        });
      }
    });
  });
};

const setMetadata = (source, { videoDetails }) => {
  console.log("metadata");
  const metadata = {
    title: videoDetails.title.replace("(lyrics)", "").replace("(Lyrics)", ""),
    author: videoDetails.author.name,
  };

  const options = {
    attachments: ["./tmp/file.jpg"],
  };

  return new Promise((resolve, reject) => {
    ffmetadata.write(source, metadata, options, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

const clearTmp = () => {
  fs.unlink("./tmp/file.jpg", () => {});
  fs.unlink("./tmp/file.mp4", () => {});
  fs.unlink("./tmp/file.mp3", () => {});
  fs.unlink("./tmp/file.webp", () => {});
};

app.get("/download/:id", async (req, res) => {
  const mp3 = "./tmp/file.mp3";
  const mp4 = "./tmp/file.mp4";

  try {
    const { id } = req.params;
    console.log(`received : ${id}`);

    const url = `https://www.youtube.com/watch?v=${id}`;
    const info = await ytdl.getInfo(url);

    await downloadVideo(url, mp4);
    await convertToMp3(mp4, mp3);
    await downloadCover(info);
    await setMetadata(mp3, info);

    const file = await new Promise((resolve, reject) => {
      console.log("read");
      fs.readFile(mp3, "base64", (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    clearTmp();

    res.send({ success: true, title: info.videoDetails.title, file });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
});

app.get("/test", async (req, res) => {
  try {
    const info = await ytdl.getInfo(
      "https://www.youtube.com/watch?v=ZMDG9qB-HqY"
    );

    const { videoDetails } = info;
    const media = videoDetails.thumbnails[0];

    const buffer = await fetch(media.url).then((response) => response.buffer());
    await new Promise((resolve, reject) => {
      fs.writeFile("./tmp/file.webp", buffer, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.send({ success: true, media, info });
  } catch (e) {
    console.error(e);
    res.status(400).send({ message: e.message });
  }
});

app.listen(8080, () => {
  console.log(
    `============= server start at : ${moment().format(
      "YYYY-MM-DD HH:mm:ss"
    )} =============`
  );
});
