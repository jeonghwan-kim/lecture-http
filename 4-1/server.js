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
function poll(req, res) {
  // 데이터가 없으면 204 헤더만 응답한다.
  if (!message) {
    res.writeHead(204);
    res.end();
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

    message = new Message(text);

    res.writeHead(200, {
      "content-type": "application/json",
    });
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

  if (pathname === "/poll") return poll(req, res);
  if (pathname === "/update") return update(req, res);

  static(req, res);
});

server.listen(3000, () => {
  console.log("server is running ::3000");
});
