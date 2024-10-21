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

// 로그인 함수입니다. (GET 요청 처리 용)
function getLogin(req, res) {
  // 쿼리 문자열에서 email과 password을 조회합니다.
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const email = searchParams.get("email");
  const password = searchParams.get("password");

  const authenticated = email === "myemail" && password === "mypassword";

  // 인증 실패
  if (!authenticated) {
    res.statusCode = 401;
    res.end("Unauthorized\n");
    return;
  }

  // 인증 성공
  res.end("Success\n");
}

// 로그인 함수입니다. (POST 요청 처리 용)
function postLogin(req, res) {
  // 요청 본문을 담을 변수
  let body = "";

  // HTTP 요청 본문이 도착할 때마다 "data" 이벤트가 발생합니다.
  req.on("data", (chunk) => {
    // 이때마다 데이터를 모아둡니다.
    body = body + chunk.toString();
  });

  // 요청 본문이 모두 도착할 경우
  req.on("end", () => {
    console.log("body", body);
    const { email, password } = querystring.parse(body);
    const authenticated = email === "myemail" && password === "mypassword";

    // 인증 실패
    if (!authenticated) {
      res.statusCode = 401;
      res.write("Unauthorized\n");
      res.end();
      return;
    }

    // 인증 성공
    res.wirte("Success\n");
    res.end();
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
    // getLogin(req, res);
    postLogin(req, res);
    return;
  }

  // 정적 파일 요청을 처리한다.
  static(path.join(__dirname, "public"))(req, res);
}

const server = http.createServer(handler);

server.listen(3000, () => {
  console.log("server is running ::3000");
});
