const http = require("http");
const fs = require("fs");
const path = require("path");
const { WebSocketServer } = require("ws");

/**
 * 채팅 메세지
 */
class Message {
  constructor(text) {
    this.text = text;
    this.timestamp = Date.now();
  }
  toString() {
    return JSON.stringify({
      text: this.text,
      timestamp: this.timestamp,
    });
  }
}

function static(req, res) {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  const filename = pathname.replace(/^\//, "") || "index.html";
  const filepath = path.resolve(__dirname, "public", filename);

  fs.readFile(filepath, (err, data) => {
    if (err) {
      console.error(err);
      res.end("Error");
      return;
    }

    res.end(data);
  });
}

/**
 * HTTP 요청을 로깅한다.
 */
const log = (req, res) => {
  console.log(`${req.method} ${req.url}`);
};

const server = http.createServer((req, res) => {
  log(req, res);

  static(req, res);
});

server.listen(3000, () => {
  console.log("server is running ::3000");
});

// 웹소켓 서버를 HTTP 서버에 연결합니다.
const wss = new WebSocketServer({ server });

/**
 * 웹 소켓 클라이언트 대기열
 * 웹 소켓 연결된 클라이언트들에게 메세지를 전달하기 위한 용도
 */
let webSocketClients = [];

wss.on("connection", (webScoket) => {
  console.log("connections");

  // 환영의 인사
  const message = new Message("서버와 연결되었습니다.");
  webScoket.send(`${message}`);

  // 클라이언트가 연결되면 대기열에 추가한다.
  webSocketClients.push(webScoket);

  webScoket.on("message", (data) => {
    // 대기열에 있는 클라이언트에게 메세지를 전달한다.
    for (const webSocketClient of webSocketClients) {
      const message = new Message(
        `${webScoket === webSocketClient ? "me:" : "other:"} ${data.toString(
          "utf-8"
        )}`
      );
      webSocketClient.send(`${message}`);
    }
  });
});
