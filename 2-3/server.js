const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const querystring = require("querystring");

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

function handler(req, res) {
  let { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === "/tracking-pixel.gif") {
    logRequest(req);
  }

  if (pathname === "/login") {
    getLoginController(req, res);
    return;
  }

  const filename = pathname.replace(/^\//, "") || "index.html";
  const filepath = path.resolve(__dirname, "public", filename);
  fs.readFile(filepath, (err, data) => {
    if (err) {
      console.error(err);
      res.end("Error");
      return;
    }

    res.end(data);
  });
}

const server = http.createServer(handler);

server.listen(3000, () => {
  console.log("server is running ::3000");
});
