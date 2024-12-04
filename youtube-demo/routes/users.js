const express = require("express");
const router = express.Router();
router.use(express.json());
const conn = require("../mariadb");
const { body, param, validationResult } = require("express-validator");

// jwt 모듈 호출
const jwt = require("jsonwebtoken");

// dotenv 모듈 호출
const dotenv = require("dotenv");
dotenv.config();

// 오류 검사하는 미들웨어 검사 -> req가 not Empty면 error 반환
const validate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next();
  } else {
    return res.status(400).json({ errors: err.array() });
  }
};

// 로그인
router.post(
  "/login",
  [
    body("email").notEmpty().isEmail().withMessage("이메일 형식이 아닙니다."),
    body("password").notEmpty().withMessage("비밀번호는 필수입니다."),
    validate,
  ],
  (req, res) => {
    const { email, password } = req.body;

    let sql = `SELECT * FROM users WHERE email = ? `;

    conn.query(sql, email, function (err, results) {
      if (err) {
        console.log(err);
        return res.status(400).end();
      }
      let loginUser = results[0];

      if (loginUser && loginUser.password == password) {
        // token 발급
        const token = jwt.sign(
          {
            email: loginUser.email,
            name: loginUser.name,
            contact: loginUser.contact,
          },
          process.env.PRIVATE_KEY,
          // 1시간 , '10m'은 10분 , issuer는 발행한 사람
          { expiresIn: "1h", issuer: "TripleS" }
        );

        // cookie 생성 (1번째 인자 : Name , 2번째 인자 : Value, 3번째 인자 { 옵션 : httpOnly, 유효기간 등등})
        res.cookie("token_box", token, { httpOnly: true });

        res.status(200).json({
          message: `${loginUser.name} 님 로그인 성공하였습니다.`,
        });
      } else {
        res.status(403).json({ error: "로그인 할 수 없습니다." });
      }
    });
  }
);

// 회원가입
router.post(
  "/join",
  [
    body("email").notEmpty().isEmail().withMessage("이메일 형식이 아닙니다."),
    body("password").notEmpty().withMessage("비밀번호는 필수입니다."),
    body("name").notEmpty().withMessage("이름은 필수입니다."),
    body("contact").notEmpty().withMessage("연락처는 필수입니다."),
    validate,
  ],
  (req, res) => {
    const { email, name, password, contact } = req.body;

    let sql = `INSERT INTO users (email, name, password, contact) VALUES (?,?,?,?)`;
    let value = [email, name, password, contact];
    conn.query(sql, value, function (err, results) {
      if (err) {
        console.log(err);
        return res.status(400).end();
      }

      res.status(201).json({ message: `${name}님 환영합니다.` });
    });
  }
);

// 회원 개별 조회
router
  .route("/users")
  .get(
    [
      body("email").notEmpty().isEmail().withMessage("이메일 형식이 아닙니다."),
      validate,
    ],
    (req, res) => {
      const { email } = req.body;

      let sql = `SELECT * FROM users WHERE email = ?`;
      conn.query(sql, email, function (err, results) {
        // results에 객체가 있다면
        if (err) {
          console.log(err);
          return res.status(400).end();
        }

        res.status(200).json(results);
      });
    }
  )

  // 회원 개별 탈퇴
  .delete(
    [
      body("email").notEmpty().isEmail().withMessage("이메일 형식이 아닙니다."),
      validate,
    ],
    (req, res) => {
      let { email } = req.body;

      let sql = `DELETE FROM users WHERE email =?`;
      conn.query(sql, email, function (err, results) {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }
        if (results.affectedRows === 0) {
          return res
            .status(404)
            .json({ error: "채널 정보를 찾을 수 없습니다." });
        } else {
          return res.status(200).json(results);
        }
      });
    }
  );

module.exports = router;
