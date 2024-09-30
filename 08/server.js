const http = require("http");
const path = require("path");
const static = require("../shared/serve-static");

function success(req, res) {
  res.writeHead(200, {
    "content-type": "application/json",
  });
  res.end(JSON.stringify({ result: "success" }));
}

function fail(req, res) {
  res.writeHead(400, {
    "content-type": "application/json",
  });
  res.end(JSON.stringify({ result: "fail" }));
}

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === "/api/success") return success(req, res);
  if (pathname === "/api/fail") return fail(req, res);

  // 정적 파일 요청을 처리한다.
  static(path.join(__dirname, "public"))(req, res);
});

server.listen(3000, () => {
  console.log("server is running ::3000");
});
