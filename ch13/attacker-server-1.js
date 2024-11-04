const http = require("http");

const log = (req, res) => console.log(`${req.method} ${req.url}`);

const server = http.createServer((req, res) => {
  log(req, res);

  res.end();
});

server.listen(3001, () => console.log("server is running ::3001"));
