const http = require("http");
const path = require("path");
const static = require("../shared/serve-static");
const Message = require("../shared/message");

let message = null;
let waitingClients = [];

const subscribe = (req, res) => {
  res.setHeader("content-type", "text/event-stream");
  res.write("\n");

  waitingClients.push(res);

  req.on("close", () => {
    waitingClients = waitingClients.filter((client) => client !== res);
  });
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

    const message = new Message(text);

    for (const waitingClient of waitingClients) {
      waitingClient.write(
        [
          `retry: 10000\n`,
          `id: ${message.timestamp}\n`,
          `data: ${message.toString()}\n\n`,
        ].join("")
      );
    }

    res.write(`${message}`);
    res.end();
  });
};

const handler = (req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === "/subscribe") return subscribe(req, res);
  if (pathname === "/update") return update(req, res);

  static(path.join(__dirname, "public"))(req, res);
};

const server = http.createServer(handler);
server.listen(3000, () => console.log("server is running ::3000"));