// https 모듈을 가져옵니다.
const https = require("https");
const fs = require("fs");
const path = require("path");

// 준비한 RSA 개인키와 인증서 파일을 가져와 옵션 객체를 준비합니다.
const options = {
  key: fs.readFileSync(path.join(__dirname, "./server.key")),
  cert: fs.readFileSync(path.join(__dirname, "./server.cert")),
};

// 서버의 요청 핸들러를 정의합니다.
const requestHandler = (req, res) => {
  // 간단히 Hello 를 본문에 실어 응답합니다.
  res.end("Hello");
};

// 옵션객체와 핸들러로 https 서버 인스턴스를 만듭니다.
const server = https.createServer(options, requestHandler);

// 3000 번 포트에서 요청을 기다립니다.
server.listen(3000, () => {
  console.log("server is running ::3000");
});
