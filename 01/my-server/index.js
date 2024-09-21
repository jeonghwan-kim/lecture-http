const http = require("http");
const fs = require("fs");
const path = require("path");

// 요청한 파일을 응답하는 함수
function static(req, res) {
  // 요청한 파일의 경로를 계산합니다.
  const filepath = path.join(__dirname, "public", req.url);

  // 요청한 파일을 읽습니다.
  fs.readFile(filepath, (err, data) => {
    // 파일을 읽지 못한 경우
    if (err) {
      res.end("Not Found");
      return;
    }

    // 파일을 읽고 내용을 응답합니다.
    res.end(data);
  });
}

// 이 컨텐츠로 요청을 처리할 핸들러 함수를 만들었습니다.
function handler(req, res) {
  static(req, res);
}

// 위 핸들러로 http 서버 객체를 하나 만들었다.
const server = http.createServer(handler);

// 서버는 3000번 포트에서 요청을 기다리게 됩니다.
server.listen(3000, () => console.log("server is running ::3000"));
