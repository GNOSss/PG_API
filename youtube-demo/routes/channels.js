// express 모듈 셋팅
const express = require("express");
const router = express.Router();
router.use(express.json());
const conn = require("../mariadb");
const { body, param, validationResult } = require("express-validator");

// 오류 검사하는 미들웨어 검사 -> req가 not Empty면 error 반환
const validate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next();
  } else {
    return res.status(400).json({ errors: err.array() });
  }
};

router
  .route("/")
  // 채널 전체 조회
  .get(
    [
      body("user_id").notEmpty().isInt().withMessage("오직 숫자만 입력하세요"),
      validate,
    ],
    (req, res) => {
      let { user_id } = req.body;

      let sql = `SELECT * FROM channels WHERE user_id = ?`;
      conn.query(sql, user_id, function (err, results) {
        if (err) {
          console.log(err);
          return res.status(404).end();
        }
        if (results && results.length) {
          return res.status(200).json(results);
        } else {
          res.status(404).json({ error: "채널 정보를 찾을 수 없습니다." });
        }
      });
    }
  )

  // 채널 개별 생성
  .post(
    [
      body("user_id").notEmpty().isInt().withMessage("오직 숫자만 입력하세요"),
      body("name").notEmpty().isString().withMessage("문자 입력 필요합니다."),
      validate,
    ],
    (req, res) => {
      let { name, user_id } = req.body;

      let sql = `INSERT INTO channels (name, user_id) VALUES (?,?)`;
      let values = [name, user_id];

      conn.query(sql, values, function (err, results) {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }
        return res.status(201).json(results);
      });
    }
  );

router
  .route("/:id")
  .get(
    [param("id").notEmpty().withMessage("id값이 필요합니다."), validate],
    (req, res) => {
      let { id } = req.params;
      id = parseInt(id, 10);

      let sql = `SELECT * FROM channels WHERE id = ?`;
      conn.query(sql, id, function (err, results) {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }

        // results에 객체가 있다면
        if (results.length) {
          res.status(200).json(results);
        } else {
          res.status(404).json({ error: "채널 정보를 찾을 수 없습니다." });
        }
      });
    }
  )

  // 채널 개별 수정
  .put(
    [
      param("id").notEmpty().withMessage("채널id 필요"),
      body("name").notEmpty().isString().withMessage("채널명 오류"),
      validate,
    ],
    (req, res) => {
      // 파라미터로 channels 테이블에 필요한 id 받아옴
      let { id } = req.params;
      id = parseInt(id, 10);

      // body본문에 channels 테이블에 필요한 name 받아옴
      let { name } = req.body;

      let sql = `UPDATE channels SET name = ? WHERE id = ?`;
      let values = [name, id];

      conn.query(sql, values, function (err, results) {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }

        // affectedRows : 조건에 맞는 행(row)의 개수(변경 여부에 상관없이)
        // chagedRows : 실제로 업데이트된 행의 개수
        if (results.affectedRows === 0) {
          return res
            .status(404)
            .json({ error: "채널 정보를 찾을 수 없습니다." });
        } else {
          return res.status(200).json(results);
        }
      });
    }
  )
  // 채널 개별 삭제
  .delete(
    [param("id").notEmpty().withMessage("채널id 필요"), validate],
    (req, res) => {
      let { id } = req.params;
      id = parseInt(id, 10);

      let sql = `DELETE FROM channels WHERE id =?`;
      conn.query(sql, id, function (err, results) {
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
