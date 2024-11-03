const http = require("http");
const path = require("path");
const static = require("../shared/serve-static");

const successApi = (req, res) => {
  res.setHeader("content-type", "application/json");
  res.write(JSON.stringify({ result: "success" }));
  res.end();
};

const failApi = (req, res) => {
  res.statusCode = 400;
  res.setHeader("content-type", "application/json");
  res.write(JSON.stringify({ result: "fail" }));
  res.end();
};

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === "/api/success") return successApi(req, res);
  if (pathname === "/api/fail") return failApi(req, res);

  static(path.join(__dirname, "public"))(req, res);
});
server.listen(3000, () => console.log("server is running ::3000"));
