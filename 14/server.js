const http = require("http");
const path = require("path");
const static = require("../shared/serve-static");

const server = http.createServer((req, res) => {
  // 3000 서버에게 응답을 허용한다.
  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // 교차 출처 요청의 X-Foo 헤더 사용을 허용한다.
  res.setHeader("Access-Control-Allow-Headers", "X-Foo");

  // 교차 출처의 PUT 요청을 허용한다.
  res.setHeader("Access-Control-Allow-Methods", "PUT");

  // 5초간 캐시를 허용한다.
  res.setHeader("Access-Control-Max-Age", "5");

  static(path.join(__dirname, "public"))(req, res);
});

// 환경변수 PORT에서 포트 번호를 가져온다. 기본값은 3000
const port = process.env.PORT || 3000;
// 해당 포트에서 요청을 기다린다.
server.listen(port, () => {
  console.log(`server is running ::${port}`);
});
