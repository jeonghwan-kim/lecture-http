const http = require("http");
const fs = require("fs");
const path = require("path");

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

/**
 * 신규 메세지
 */
let message = null;
/**
 * 응답 대기중인 클라이언트들
 */
let waitingClients = [];

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
 * 채팅 메세지를 조회한다.
 */
function longPoll(req, res) {
  // 데이터가 없으면 응답을 지연한다.
  if (!message) {
    // 클라이언트 대기열에 추가한다.
    waitingClients.push(res);

    // 10초간 기다리고 408 Reuqest Timeout을 응답한다.
    res.setTimeout(10000, () => {
      res.writeHead(408);
      res.end();
    });

    return;
  }

  // 데이터가 있으면 응답하고 비운다.
  res.writeHead(200, {
    "content-type": "application/json",
  });
  res.end(`${message}`);
  message = null;
}

/**
 * 채팅 메세지를 갱신합니다.
 *
 * curl 'http://localhost:3000/update' \
 *   --header 'content-type: application/json' \
 *   --data '{"text": "hello"}'
 */
function update(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body = body + chunk.toString();
  });

  req.on("end", () => {
    const { text } = JSON.parse(body);

    if (!text) {
      res.writeHead(400, {
        "content-type": "application/json",
      });
      res.end(
        JSON.stringify({
          error: "text 필드를 채워주세요",
        })
      );
      return;
    }

    // 메세지를 만들고 기억해 둔다.
    message = new Message(text);

    for (const waitingClient of waitingClients) {
      waitingClient.writeHead(200, {
        "content-type": "application/json",
      });
      waitingClient.end(`${message}`);
    }

    // 본 요청한 클라이언트에게 응답한다.
    res.end(`${message}`);

    // 메세지와 클라이언트 대기열을 비운다
    message = null;
    waitingClients = [];
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

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === "/longpoll") return longPoll(req, res);
  if (pathname === "/update") return update(req, res);

  static(req, res);
});

server.listen(3000, () => {
  console.log("server is running ::3000");
});
