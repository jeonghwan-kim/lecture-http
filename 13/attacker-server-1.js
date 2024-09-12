/**
 * 127.0.0.1 attacker.com 레코드를 추가하세요
 */

const http = require("http");

const log = (req, res) => {
  console.log(`${req.method} ${req.url}`);
};

const server = http.createServer((req, res) => {
  log(req, res);

  res.end("Success");
});

server.listen(3001, () => {
  console.log("server is running ::3001");
});
