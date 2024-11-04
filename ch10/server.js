const http = require("http");
const path = require("path");
const static = require("../shared/serve-static");
const Message = require("../shared/message");

let message = null;

const handler = (req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  // todo

  static(path.join(__dirname, "public"))(req, res);
};

const server = http.createServer(handler);
server.listen(3000, () => console.log("server is running ::3000"));
