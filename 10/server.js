const http = require("http");
const path = require("path");
const static = require("../shared/serve-static");

/**
 * 채팅 메세지
 */
class Message {
  /**
   * text와 인스턴스 생성 시간을 저장합니다.
   */
  constructor(text) {
    this.text = text;
    this.timestamp = Date.now();
  }

  /**
   * 텍스트를 문자열로 변환합니다.
   * HTTP 응답 본문에에 사용할 겁니다.
   */
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
let latestMessage = null;
/**
 * 응답 대기중인 클라이언트들
 */
let waitingClients = [];

/**
 * 채팅 메세지를 조회한다.
 */
function longPoll(req, res) {
  // 데이터가 없으면 응답을 지연한다.
  if (!latestMessage) {
    // 클라이언트 대기열에 추가한다.
    waitingClients.push(res);

    // 10초간 기다리고 408 Reuqest Timeout을 응답한다.
    res.setTimeout(10000, () => {
      res.statusCode = 408;
      res.end();
    });

    return;
  }

  // 데이터가 있으면 응답하고 비운다.
  if (!res.headersSent) {
    res.setHeader("content-type", "application/json");
    res.write(`${latestMessage}\n`);
    res.end();
    latestMessage = null;
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
      res.statusCode = 400;
      res.setHeader("content-type", "application/json");
      res.body(
        JSON.stringify({
          error: "text 필드를 채워주세요",
        })
      );
      res.end();
      return;
    }

    // 메세지를 만들고 기억해 둔다.
    latestMessage = new Message(text);

    // 대기열에있는 클라이언트에게 응답한다.
    for (const waitingClient of waitingClients) {
      if (!waitingClient.headersSent) {
        waitingClient.setHeader("content-type", "application/json");
        waitingClient.write(`${latestMessage}`);
        waitingClient.end();
      }
    }

    if (!res.headersSent) {
      // 본 요청한 클라이언트에게도 응답한다.
      res.body(`${latestMessage}`);
      res.end();
    }

    // 메세지와 클라이언트 대기열을 비운다
    latestMessage = null;
    waitingClients = [];
  });
}

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === "/longpoll") return longPoll(req, res);
  if (pathname === "/update") return update(req, res);

  // 정적 파일 요청을 처리한다.
  static(path.join(__dirname, "public"))(req, res);
});

server.listen(3000, () => {
  console.log("server is running ::3000");
});
