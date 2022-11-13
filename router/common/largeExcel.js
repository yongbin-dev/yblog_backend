import { Router } from "express";
const router = Router();
import multer, { diskStorage } from "multer";
import { readdirSync, mkdirSync } from "fs";

try {
  readdirSync("uploads/excel");
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  mkdirSync("uplaods/excel");
}

const upload = multer({
  storage: diskStorage({
    destination(req, file, done) {
      done(null, "uploads/excel");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/upload/excel", (req, res) => {
  res.sendFile(path.join(__dirname, "multipart2.html"));
});

router.post(
  "/largeExcelUpload",
  upload.fields([{ name: "image" }, { name: "image2" }], (req, res) => {
    console.log(req.files, req.body);
    res.send("ok");
  })
);

