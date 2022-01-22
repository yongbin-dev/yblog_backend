const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const {
  article,
  user,
  company,
  board,
  comment,
  reply,
  common,
} = require("./router");
const app = express();
const PORT = 8080;
const SECRET = "@askdasklF!@#123dnasdnkas";

//파일업로드 Multipart/form-data
const multer = require("multer");

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// JWT 시크릿 할당
app.set("jwt-secret", SECRET);

// 기능
app.use(article);
app.use(company);
app.use(board);
app.use(user);
app.use(comment);
app.use(reply);
app.use(common);

app.use(formidable());

app.get("/", (req, res) => {
  res.send("Server is Running!");
});

app.listen(PORT, "localhost", () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
