const http = require("http");
const { URL } = require("url");
const querystring = require("querystring");
const path = require("path");
const static = require("../shared/serve-static");

// 로깅 함수입니다.
function logRequest(req) {
  const log = [
    // 유저의 사용시간을 알수 있습니다.
    `${new Date().toISOString()}`,

    // 유저의 접속 지역을 알 수 있습니다.
    `IP: ${req.socket.remoteAddress || req.connection.remoteAddress}`,

    // 유저가 사용하는 단말기를 추정할 수 있습니다.
    `User-Agent: ${req.headers["user-agent"]}`,

    // 사용자가 어떤 페이지를 보는지 알 수 있습니다.
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

  // GET /tracking-pixel.git 요청이 오면 로깅합니다.
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
