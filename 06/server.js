const http = require("http");
const path = require("path");
const { URL } = require("url");
const static = require("../shared/serve-static");

function handleLogin() {
  let body = "";
  req.on("data", (chunk) => {
    body = body + chunk.toString();
  });
  req.on("end", () => {
    res.end(body);
  });
}

function handleJsonLogin(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body = body + chunk.toString();
  });

  req.on("end", () => {
    // 요청 본문을 JSON 객체로 파싱합니다.
    const { email, password } = JSON.parse(body);

    // 인증
    const authenticated = email === "myemail" && password === "mypassword";

    // 인증 결과에 따라 헤더를 실습니다.
    res.writeHead(authenticated ? 200 : 401, {
      "Content-Type": "application/json",
    });
    // 인증 결과를 응답 본문에 실어 보냅니다.
    res.end(JSON.stringify({ authenticated }));
  });
}

function handler(req, res) {
  let { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === "/login") {
    // handleLogin(req, res);
    handleJsonLogin(req, res);
    return;
  }

  // 정적 파일 요청을 처리한다.
  static(path.join(__dirname, "public"))(req, res);
}

const server = http.createServer(handler);

server.listen(3000, () => {
  console.log("server is running ::3000");
});
