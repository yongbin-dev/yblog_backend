const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

require("dotenv").config();

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
const SECRET = "@askdasklF!@#123dnasdnkas";

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

var deployType = `${process.env.DEPLOY_TYPE}`;
var url = "localhost";
var port = "8001";

// if (deployType !== "DEV") {
//   url = "sub.ybyblog.com";
//   port = "80";
// }

app.listen(port, url, () => {
  console.log(`App listening at http://${url}:${port}`);
});
