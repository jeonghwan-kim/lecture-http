const http = require("http");
const path = require("path");
const static = require("../shared/serve-static");
const Message = require("../shared/message");


let message = null;

const poll = (req, res) => {
  if (!message) {
    res.statusCode = 204;
    res.end();
    return;
  }

  res.setHeader("content-type", "application/json");
  res.write(`${message}\n`);
  res.end();

  message = null;
};

const update = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body = body + chunk.toString();
  });

  req.on("end", () => {
    const { text } = JSON.parse(body);

    if (!text) {
      res.statusCode = 400;
      res.setHeader("content-type", "application/json");
      res.write(
        JSON.stringify({
          error: "text 필드를 채워주세요",
        })
      );
      res.end();
      return;
    }

    message = new Message(text);

    res.setHeader("content-type", "application/json");
    res.write(JSON.stringify(`${message}`));
    res.end();
  });
};

const handler = (req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === "/poll") return poll(req, res);
  if (pathname === "/update") return update(req, res);

  static(path.join(__dirname, "public"))(req, res);
};

const server = http.createServer(handler);
server.listen(3000, () => console.log("server is running ::3000"));
