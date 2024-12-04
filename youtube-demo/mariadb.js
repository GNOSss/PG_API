// Get the client
const mysql = require("mysql2");

// Create the connection to database
const connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "930809",
  database: "Youtube",
  // sql에서 Mon Dec 02 2024 11:58:59 GMT+0900 (대한민국 표준시) 이따구로 출력되는걸
  // 2024-12-02 11:59:59로 깔끔하게 출력 시켜주는 세팅
  dateStrings: true,
});

module.exports = connection;
