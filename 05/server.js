const http = require("http");
const { URL } = require("url");
const querystring = require("querystring");
const path = require("path");
const static = require("../shared/serve-static");

/**
 * 요청 로깅
 */
function logRequest(req) {
  const log = [
    `${new Date().toISOString()}`,
    `IP: ${req.socket.remoteAddress || req.connection.remoteAddress}`,
    `User-Agent: ${req.headers["user-agent"]}`,
    `Referer: ${req.headers["referer"]}`,
  ].join(", ");
  console.log(log);
}

/**
 * 로그인 컨트롤러
 * GET 메소드 요청을 처리한다.
 */
function getLoginController(req, res) {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const email = searchParams.get("email");
  const password = searchParams.get("password");

  const authenticated = email === "myemail" && password === "mypassword";

  if (!authenticated) {
    res.end("Fail");
    return;
  }

  res.end("Success");
}

/**
 * 로그인 컨트롤러
 * POST 메소드 요청을 처리한다.
 */
function postLoginController(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body = body + chunk.toString();
  });
  req.on("end", () => {
    const { email, password } = querystring.parse(body);
    const authenticated = email === "myemail" && password === "mypassword";

    if (!authenticated) {
      res.end("Fail");
      return;
    }

    res.end("Success");
  });
}

// 요청 핸들러 함수
function handler(req, res) {
  let { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === "/tracking-pixel.gif") {
    logRequest(req);
  }

  if (pathname === "/login") {
    getLoginController(req, res);
    return;
  }

  // 정적 파일 요청을 처리한다.
  static(path.join(__dirname, "public"))(req, res);
}

const server = http.createServer(handler);

server.listen(3000, () => {
  console.log("server is running ::3000");
});
