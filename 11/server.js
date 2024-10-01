const http = require("http");
const fs = require("fs");
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
 * 응답 대기중인 클라이언트들
 */
let waitingClients = [];

/**
 * 이벤트 스트림을 구독한다.
 */
function subscribe(req, res) {
  // 응답 헤더에 content-type: text/event-stream을 실었습니다.
  // 클라이언트에게 SSE 프로토콜의 시작을 알립니다.
  res.writeHead(200, {
    "content-type": "text/event-stream",
  });
  // 빈 줄로 헤더 끝을 표시합니다.
  res.write("\n");

  // 요청한 클라이언트를 대기열에 추가합니다.
  // 종료 응답을 하지 않고 클라이언트와 연결을 유지합니다.
  waitingClients.push(res);

  // 클라이언트가 요청을 취소할 수도 있는데요(예: 브라우져 탭을 닫은 경우).
  // 그러면 대기열에서 제거합니다. 더 이상 구독하지 않기 때문입니다.
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

  // 요청 본문을 모두 수신하면 대기열의 클라이언트에게 알림을 보냅니다.
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
          // 알림 메세지이기 때문에 data 필드를 사용해 이벤트를 응답 본문에 실었습니다.
          // 이벤트를 여러 번 보낼 수 있는데요. 개행문자로 구분합니다.
          // 마지막에 '\n\n'문자를 추가해서 하나의 이벤트라는걸 표시했습니다.
          `data: ${message.toString()}\n\n`,
        ].join("")
      );
    }

    // 본 요청한 클라이언트에게 응답한다.
    res.end(`${message}`);
  });
}

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === "/subscribe") return subscribe(req, res);
  if (pathname === "/update") return update(req, res);

  // 정적 파일 요청을 처리한다.
  static(path.join(__dirname, "public"))(req, res);
});

server.listen(3000, () => {
  console.log("server is running ::3000");
});
