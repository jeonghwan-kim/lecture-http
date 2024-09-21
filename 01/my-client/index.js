const http = require("http");

// 명령어 인자로 받은 url
const url = process.argv[2];

// url 인자가 없으면 오류를 출력하고 종료합니다.
if (!url) {
  console.error("Usage: node my-client/index.js <url>");
  process.exit();
}

// 인자로 접속하는 url 객체를 준비합니다.
const options = new URL(url);

// http 모듈의 request 함수로 서버에 요청을 보내는 reqeust 객체를 구성합니다.
const req = http.request(options, (res) => {
  const data = [];
  res.on("data", (chunk) => {
    data.push(chunk.toString());
  });
  res.on("end", () => {
    console.log(data.join(""));
  });
});

req.on("error", (err) => {
  console.error(err);
});

req.end();
