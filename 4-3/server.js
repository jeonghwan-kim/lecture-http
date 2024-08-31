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
 * 이벤트 스트림을 구독한다.
 */
function subscribe(req, res) {
  if (!health) {
    res.writeHead(500);
    res.end();
    return;
  }

  res.writeHead(200, {
    "content-type": "text/event-stream",
  });
  res.write("\n");

  waitingClients.push(res);

  // 요청 취소 처리
  req.on("close", () => {
    waitingClients = waitingClients.filter((client) => client !== res);
  });

  const lastEventId = req.headers["last-event-id"];
  if (lastEventId) {
    // 클라이언트가 받지 못한 이벤트를 응답한다.
    console.log("lastEventId:", lastEventId);
  }
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
    const message = new Message(text);

    for (const waitingClient of waitingClients) {
      waitingClient.write(
        [
          // 재시도 간격 (밀리초 단위)
          `retry: 10000\n`,
          // 이벤트 식별자
          `id: ${message.timestamp}\n`,
          // 이벤트 데이터
          `data: ${message.toString()}\n\n`,
        ].join("")
      );
    }

    // 본 요청한 클라이언트에게 응답한다.
    res.end(`${message}`);
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

  if (pathname === "/subscribe") return subscribe(req, res);
  if (pathname === "/update") return update(req, res);

  static(req, res);
});

server.listen(3000, () => {
  console.log("server is running ::3000");
});
