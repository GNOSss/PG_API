const express = require("express");
const app = express();

app.listen(9300, () => {
  console.log("9300 서버 실행되었습니다.");
});

let youtuber1 = {
  name: "SEUNGSOO_coding",
  channel: "seungsoo_channel",
  subscribers: 1000,
};

let youtuber2 = {
  name: "COCO_Foodfight",
  channel: "coco_channel",
  subscribers: 2000,
};

let youtuber3 = {
  name: "BORA_coding",
  channel: "bora_channel",
  subscribers: 3000,
};

const db = new Map();

let idx = 1;

// .set(키, 값)
db.set(idx++, youtuber1);
db.set(idx++, youtuber2);
db.set(idx++, youtuber3);

app.get("/youtubers", (req, res) => {
  // 방식 1 : 벨류 가져옴
  // const youtuberList = Array.from(db.values());
  // res.json(youtuberList);

  // 방식 2 : 벨류 가져옴
  //   youtuberNames = [];

  //   db.forEach(function (youtuberList) {
  //     youtuberNames.push(youtuberList);
  //   });

  //   res.json(youtuberNames);
  // });

  // 방식 3 : 키 벨류 가져옴
  let jsonObject = {};
  db.forEach(function (value, key) {
    jsonObject[key] = value;
  });

  res.json(jsonObject);
});

app.get("/youtubers/:id", (req, res) => {
  let { id } = req.params;
  id = parseInt(id);

  const youtuber = db.get(id);
  if (youtuber == undefined) {
    res.json({ error: "Not found" });
    console.log("Not found Youtuber 입니다.");
  } else {
    res.json(youtuber);
  }
});

// express.json() 미들웨어는 클라이언트가 JSON형식으로 보낸 데이터를 파싱할 수 있음
app.use(express.json());
app.post("/youtubers", (req, res) => {
  console.log(req.body);

  db.set(idx++, req.body);

  res.json({
    message: `${db.get(idx - 1).name}님 ${req.body.channel} 개설을 환영합니다.`,
  });
});
