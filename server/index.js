const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const moment = require("moment");
const fs = require("fs");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const { exec } = require("child_process");
const stream = require("stream");

const app = express();

app.use(cors());

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/download/:id", async (req, res) => {
  const mp3 = "./tmp/file.mp3";
  const mp4 = "./tmp/file.mp4";

  try {
    const { id } = req.params;
    const url = `https://www.youtube.com/watch?v=${id}`;
    const {
      videoDetails: { title },
    } = await ytdl.getInfo(url);

    await new Promise((resolve, reject) => {
      const stream = ytdl(url, {
        quality: "lowest",
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
        .pipe(fs.createWriteStream(mp4));
    });

    await convertToMp3(mp4, mp3);

    const file = await new Promise((resolve, reject) => {
      console.log("read");
      fs.readFile(mp3, "base64", (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    res.send({ success: true, title, file });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
});

app.get("/test", async (req, res) => {
  try {
    const file = await new Promise((resolve, reject) => {
      fs.readFile("./tmp/test.mp3", "base64", (err, file) => {
        if (err) reject(err);
        else resolve(file);
      });
    });

    res.send({ success: true, file, title: "music style" });
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
