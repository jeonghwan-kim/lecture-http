const http = require("http");
const fs = require("fs");
const path = require("path");

// 요청한 파일을 응답한다.
function handler(req, res) {
  const filename = req.url.replace(/^\//, "");
  console.log(filename);
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
// server.keepAliveTimeout = 1000; // Keep-Alive 타임아웃 설정 (기본: 5000 밀리초)

server.listen(3000, () => console.log("server is running ::3000"));
