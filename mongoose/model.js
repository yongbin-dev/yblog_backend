const mongoose = require("mongoose");
const schema = require("./schema");
require("dotenv").config();

const db = mongoose.connection;
const model = (() => {
  db.on("error", console.error);
  db.on("open", () => {
    console.log("Connecting mongodb!");
  });

  // 몽고디비 앱 엑세스 주소
  mongoose.connect(
    `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASSWORD}@cluster0.5qfhq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  );

  // 스키마 연결
  const model = {};
  for (let key in schema) {
    model[key] = mongoose.model(key, schema[key]);
  }
  return model;
})();

module.exports = model;
