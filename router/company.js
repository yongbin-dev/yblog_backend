const express = require("express");
const router = express.Router();
const { Company } = require("../mongoose/model");

// 회사 추가
router.post("/company/create", async (req, res) => {
  const { name, about, url } = req.body;

  const isSameNameCheck = await Company.find({ name: name });

  if (isSameNameCheck.length > 0) {
    return res.send({
      error: true,
      msg: "이미 존재하는 회사명입니다.",
    });
  }

  const newCompany = await Company({
    name,
    about,
    url,
  }).save();

  res.send(newCompany);
});

// 회사 추가
router.get("/company/list", async (req, res) => {
  const company = await Company.find();
  res.send(company);
});

// 회사 인기있는 목록 불러오기
router.get("/company/list/famous", async (req, res) => {
  const company = await Company.find().limit(10).sort({ realtimeScore: -1 });
  res.send(company);
});

module.exports = router;
