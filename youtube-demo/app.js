const express = require("express");
const app = express();
app.listen(7777);

const userRouter = require("./routes/users"); // user-demo 소환
const channelRouter = require("./routes/channels"); // channel-demo 소환

app.use("/", userRouter); // user-demo 미들웨어로 추가 , '/'경로에서 동작하도록 설정
// channel-demo 미들웨어로 추가 , '/'경로에서 동작하도록 설정
app.use("/channels", channelRouter); // 라우트 URL의 공통경로 channels로 등록
