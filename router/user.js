const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../mongoose/model");

// 로그인 요청
router.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  const loginUser = await User.findOne({ email: email });

  if (!loginUser) {
    return res.send({
      error: true,
      msg: "존재하지 않는 이메일",
    });
  }

  const correctPassword = await loginUser.authenticate(password);
  if (!correctPassword) {
    return res.send({
      error: true,
      msg: "비밀번호 불일치",
    });
  }

  const secret = req.app.get("jwt-secret");

  const token = jwt.sign(
    {
      id: loginUser._id,
      email: loginUser.email,
      nickname: loginUser.nickname,
      authYn: loginUser.authYn,
    },
    secret,
    {
      expiresIn: "7d",
      issuer: "blind_clone_coding",
      subject: "auth",
    }
  );
  res.send({
    data: {
      userName: loginUser.nickname,
      authorization: token,
      error: false,
      msg: "로그인 성공",
    },
  });
});

// 사용자 추가
router.post("/user/create", async (req, res) => {
  const { nickname, company, email, password , authYn } = req.body;

  const auth = authYn ? 'Y' : 'N';

  const newUser = await User({
    email,
    nickname,
    password,
    company,
    auth
  }).save();

  res.send(newUser._id ? true : false);
});

// 사용자 토큰 체크
router.get("/user/token", (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.send(false);
  }
  const token = authorization.split(" ")[1];
  const secret = req.app.get("jwt-secret");

  jwt.verify(token, secret, (err, data) => {
    if (err) {
      res.send(err);
    }
    res.send({
      data: {
        accessToken: token,
        userName: data.nickname,
        authYn: data.authYn,
      },
    });
  });
});

// 사용자 정보 변경

// 사용자 삭제

// 프로필 이미지 추가

module.exports = router;
