// express 모듈 셋팅
const express = require("express");
const app = express();
app.listen(7777);
app.use(express.json()); //클라이언트가 JSON형식으로 보낸 데이터를 파싱할 수 있음

let db = new Map();
let id = 1; // RDBMS를 비유하면 PK 같은 기능을 함

// 로그인
app.post("/login", (req, res) => {
  console.log(req.body); // userId , pwd

  // userId가 디비에 저장된 회원인지 확인해야함
  const { userId, password } = req.body;

  let userIdCheck = false; // userId가 일치하는 유저를 찾았는지 확인
  let passwordCheck = false; // password가 일치하는지 확인

  db.forEach((user) => {
    // db의 userId와 req.body의 userId가 일치 하는지
    if (user.userId === userId) {
      userIdCheck = true;
      // db의 password와 req.body의 password가 일치 하는지
      if (user.password === password) {
        passwordCheck = true;
      }
    }
  });

  if (userIdCheck && passwordCheck) {
    res.status(200).json({ message: "로그인 성공" });
  } else if (userIdCheck && !passwordCheck) {
    res.status(400).json({ message: "비밀번호가 틀렸습니다." });
  } else {
    res.status(400).json({ message: "아이디가 존재하지 않습니다." });
  }
});

// 회원 가입
app.post("/join", (req, res) => {
  const { userId, password, name } = req.body;

  if (!userId || !password || !name) {
    res.status(400).json({ error: "userId, password, name은 필수입니다." });
  } else {
    db.set(id++, { userId, password, name });
    res.status(201).json({ message: `${db.get(id - 1).name}님 환영합니다.` });
  }
});

// 회원 정보 조회
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const user = db.get(parseInt(id));

  if (!user) {
    res.status(404).json({ error: "존재하지 않는 id입니다." });
  } else {
    res.status(200).json({
      userId: user.userId,
      name: user.name,
    });
  }
});

// 회원 개별 탈퇴
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const idNumber = parseInt(id, 10); // 문자열을 숫자로 변환
  const user = db.get(idNumber);

  if (!user) {
    res.status(404).json({ error: "존재하지 않는 id입니다." });
  } else {
    db.delete(idNumber); // 숫자형 키 삭제
    console.log("현재 db 상태:", Array.from(db.entries())); // db 상태 확인
    res.status(200).json({
      message: `${user.name}님 다음에 또 뵙겠습니다.`,
    });
  }
});
