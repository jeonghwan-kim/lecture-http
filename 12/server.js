const http = require("http");
const fs = require("fs");
const path = require("path");
const { WebSocketServer } = require("ws");
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

const server = http.createServer((req, res) => {
  // 정적 파일 요청을 처리한다.
  static(path.join(__dirname, "public"))(req, res);
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

// 클라이언트와 핸드쉐이킹
wss.on("connection", (webScoket) => {
  console.log("connection handshaking");

  // 환영의 인사
  const message = new Message("서버와 연결되었습니다.");
  webScoket.send(`${message}`);

  // 클라이언트가 연결되면 대기열에 추가한다.
  webSocketClients.push(webScoket);

  // 클라이언트로부터 메세지를 받은 경우
  webScoket.on("message", (data) => {
    // 대기열에 있는 클라이언트에게 메세지를 전달한다.
    for (const webSocketClient of webSocketClients) {
      // 대기열에 있는 클라이언트에게 전달할 메세지
      const text = `${
        webScoket === webSocketClient ? "me:" : "other:"
      } ${data.toString("utf-8")}`;
      const message = new Message(text);

      // 메세지를 전달
      webSocketClient.send(`${message}`);
    }
  });
});
