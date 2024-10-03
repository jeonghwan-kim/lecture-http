/**
 * 127.0.0.1 attacker.com 레코드를 추가하세요
 */

const http = require("http");

// 요청 URL을 로깅합니다.
// 탈취한 정보가 요청 URL로 올겁니다.
const log = (req, res) => {
  console.log(`${req.method} ${req.url}`);
};

// 서버 인스턴스를 준비합니다.
const server = http.createServer((req, res) => {
  // 모든 요청을 기록합니다.
  log(req, res);

  // 빈 응답을 보냈습니다.
  res.end("Success");
});

// 어플리케이션 서버와 다른 포트를 사용해 요청 대기합니다.
server.listen(3001, () => {
  console.log("server is running ::3001");
});
