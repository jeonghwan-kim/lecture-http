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
 * 클라이언트가 메세지를 서버에 전달하면 이 변수에 담아 둘겁니다.
 * 조회용 HTTP 요청이 오면 이 메세지를 응답 본문에 실어줄 거게요.
 */
let latestMessage = null;

/**
 * 채팅 메세지를 조회한다.
 */
function poll(req, res) {
  // 채팅 메세지가 없으면 204 No Content 상태코드를 응답합니다.
  // 메세지 본문은 비워둡니다.
  if (!latestMessage) {
    res.statusCode = 204;
    res.end();
    return;
  }

  // 채팅 메세지가 있으면 응답 본문에 실어서 보냅니다.
  res.setHeader("content-type", "application/json");
  res.body(`${latestMessage}\n`);
  res.end();

  // 다음 메세지를 응답하기위해 message 변수는 비웠습니다.
  latestMessage = null;
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

    latestMessage = new Message(text);

    res.setHeader("content-type", "application/json");
    res.write(`${latestMessage}`);
    res.end();
  });
}

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === "/poll") return poll(req, res);
  if (pathname === "/update") return update(req, res);

  // 정적 파일 요청을 처리한다.
  static(path.join(__dirname, "public"))(req, res);
});

server.listen(3000, () => {
  console.log("server is running ::3000");
});
