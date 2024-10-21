const http = require("http");

// 이 컨텐츠로 요청을 처리할 핸들러 함수를 만들었습니다.
function handler(req, res) {
  // 요청 헤더에서 Cookie 값을 조회합니다.
  const cookie = req.headers["cookie"];

  // Cookie 요청 헤더가 있고 sid 값이 있다며 이전에 방문한 클라이언트라고 판단할 수 있습니다.
  if (cookie && cookie.includes("sid")) {
    // 이전에 방문한 클라이언트다.
    res.write("Welcome again.\n");
    res.end();
    return;
  }

  // 처음 방문하면 서버가 Set-Cookie 헤더에 "sid=1" 실었습니다.
  // 이후에 브라우져가 다시 요청하면 Cookie 요청 헤더에 그대로 실어 보내기 때문입니다.
  // res.setHeader("Set-Cookie", "sid=1");
  // res.setHeader("Set-Cookie", "sid=1; Domain=foo.com");
  // res.setHeader("Set-Cookie", "sid=1; Path=/private");
  // res.setHeader("Set-Cookie", "sid=1; Max-Age=10");
  // res.setHeader("Set-Cookie", "sid=1; Secure");
  res.setHeader("Set-Cookie", "sid=1; HttpOnly");

  // 첫 방문한 응답 본문 도 실어 보냅니다.
  res.write("Welcome\n");
  res.end();
}

// 위 핸들러로 http 서버 객체를 하나 만듭니다.
const server = http.createServer(handler);

// 서버는 3000번 포트에서 요청을 기다리게 됩니다.
server.listen(3000, () => console.log("server is running ::3000"));
