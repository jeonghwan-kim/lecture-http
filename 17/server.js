const http = require("http");
const path = require("path");
const static = require("../shared/serve-static");

// HTTP 서버 생성
const server = http.createServer((req, res) => {
  static(path.join(__dirname, "public"))(req, res);
});

// 환경변수 PORT에서 포트 번호를 가져온다. 기본값은 3000
const port = process.env.PORT || 3000;
// 해당 포트에서 요청을 기다린다.
server.listen(port, () => {
  console.log(`server is running ::${port}`);
});
