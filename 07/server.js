const http = require("http");
const path = require("path");
const { URL } = require("url");
const static = require("../shared/serve-static");

// 본문을 5번씩 쪼게서 응답한다.
async function chunk(req, res) {
  // 5번 쪼게서 응답할 겁니다.
  const totalChunks = 5;
  // 1초씩 지연해서 응답할 겁니다.
  const delayInMS = 1000;
  // 한 번에 보낼 데이터 크기입니다.
  const chunkSize = 8;

  res.writeHead(200, {
    "Content-Type": "text/plain",
    // 응답 본문의 전체 길이
    "Content-Length": totalChunks * chunkSize,
  });

  // 1초씩 지연하면서 8바이트 청크를 5번 응답합니다.
  for (let i = 0; i < totalChunks; i++) {
    res.write(`chunk ${i}\n`);
    await new Promise((resolve) => setTimeout(resolve, delayInMS));
  }

  // 응답을 종료합니다.
  res.end();
}

function upload(req, res) {
  res.writeHead(200, {
    "content-type": "text/plain",
  });
  res.end("success");
}

function handler(req, res) {
  let { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === "/chunk") return chunk(req, res);
  if (pathname === "/upload") return upload(req, res);

  // 정적 파일 요청을 처리한다.
  static(path.join(__dirname, "public"))(req, res);
}

const server = http.createServer(handler);

server.listen(3000, () => {
  console.log("server is running ::3000");
});
