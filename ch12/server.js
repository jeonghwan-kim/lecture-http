const http = require("http");
const path = require("path");
const { WebSocketServer } = require("ws");
const static = require("../shared/serve-static");
const Message = require("../shared/message");

const server = http.createServer((req, res) => {
  static(path.join(__dirname, "public"))(req, res);
});
server.listen(3000, () => console.log("server is running ::3000"));

const webSocketServer = new WebSocketServer({ server });
const webSocketClients = [];

webSocketServer.on("connection", (webScoket) => {
  console.log("connection handshaking");

  const message = new Message("서버와 연결되었습니다.");
  webScoket.send(`${message}`);

  webSocketClients.push(webScoket);

  webScoket.on("message", (data) => {
    for (const webSocketClient of webSocketClients) {
      const text = `${
        webScoket === webSocketClient ? "me:" : "other:"
      } ${data.toString("utf-8")}`;
      const message = new Message(text);
      webSocketClient.send(`${message}`);
    }
  });
});
