const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

async function chunk(req, res) {
  // 5번 쪼게서 응답할 것이다.
  const iterateCount = 5;

  // 헤더 응답.
  res.writeHead(200, {
    "content-type": "text/plain",
    // 응답 본문의 전체 길이다.
    "content-length": iterateCount * 8,
  });

  // 1초씩 지연하면서 8바이트 청크를 5번 응답한다.
  for await (const i of Array(iterateCount).keys()) {
    res.write(`chunk ${i}\n`);
    await new Promise((res) => setTimeout(res, 1000));
  }

  // 응답 종료.
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

const server = http.createServer(handler);

server.listen(3000, () => {
  console.log("server is running ::3000");
});
