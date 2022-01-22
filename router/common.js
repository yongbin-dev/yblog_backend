const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
require("dotenv").config();

const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: `${process.env.AWS_S3_ACCESS_KEY}`,
  secretAccessKey: `${process.env.AWS_S3_SECRET_KEY}`,
  region: "ap-northeast-2",
});

const s3 = new AWS.S3();

var fs = require("fs");
var path = require("path");
var mime = require("mime");

const BUCKET_NAME = "nanyb-bucket";

router.post("/upload/file", upload.single("file"), function (req, res, next) {
  // req.body는 텍스트 필드를 포함합니다.
  if (!req.file) {
    return res.send({ error: true, data: null, msg: "파일이 첨부되지않음" });
  }

  // Bucket 폴더 check
  isCheckFolderS3Bucket("assets").then((check) => {
    var isCheck = false;
    if (check.Contents) {
      var arr = check.Contents;

      arr.forEach((element) => {
        key = element.Key;
        key = key.substring(0, key.length - 1).trim();
        if (key == "assets") {
          isCheck = true;
        }
      });
    }

    if (!check) {
      // 폴더 생성
      makeFolderS3Bucket();
    }

    const raw = req.file;
    const buffer = req.file.buffer;
    const filename = req.file.originalname + "_" + new Date().getTime();

    s3.upload({
      Bucket: BUCKET_NAME,
      Key: "assets/" + filename, // ex) assets/
      Body: buffer, // input.files[0]
    })
      .on("httpUploadProgress", (evt) => {
        // parseInt((evt.loaded * 100) / evt.total);
      })
      .send((err, data) => {
        res.send({
          error: false,
          data: { filename: data.Location },
          msg: "성공",
        });
      });
  });
});

router.post("/upload/cancel", function (req, res) {
  var image = req.body.imageArr;

  image.forEach((image) => {
    var imageUrl = image.substring(image.indexOf("assets"));

    s3.deleteObject(
      {
        Bucket: BUCKET_NAME, // 사용자 버켓 이름
        Key: imageUrl, // 버켓 내 경로
      },
      (err, data) => {
        if (err) {
          throw err;
        }
        console.log("s3 deleteObject ", data);
      }
    );
  });
});

router.get("/uploads/:filename", function (req, res) {
  var upload_folder = "./uploads/";
  var file = upload_folder + req.params.filename; // ex) /upload/files/sample.txt

  try {
    if (fs.existsSync(file)) {
      // 파일이 존재하는지 체크
      var filename = path.basename(file); // 파일 경로에서 파일명(확장자포함)만 추출
      var mimetype = mime.getType(file); // 파일의 타입(형식)을 가져옴

      res.setHeader("Content-disposition", "attachment; filename=" + filename); // 다운받아질 파일명 설정
      res.setHeader("Content-type", mimetype); // 파일 형식 지정

      var filestream = fs.createReadStream(file);
      filestream.pipe(res);
    } else {
      res.send("해당 파일이 없습니다.");
      return;
    }
  } catch (e) {
    // 에러 발생시
    console.log(e);
    res.send("파일을 다운로드하는 중에 에러가 발생하였습니다.");
    return;
  }
});

function makeFolderS3Bucket() {
  const params = {
    Bucket: BUCKET_NAME,
    Key: "assets/",
  };

  s3.putObject(params, (err, data) => {
    if (err) {
      console.log(err);
      return res.send({ error: true, data: null, msg: "S3 폴더 생성에러" });
    }
  });
}

async function isCheckFolderS3Bucket(folderName) {
  const params = {
    Bucket: "nanyb-bucket",
    MaxKeys: 2,
  };

  const check = await s3
    .listObjectsV2(params, (err, url) => {
      if (err) {
        throw err;
      }
    })
    .promise();

  return check;
}

module.exports = router;
