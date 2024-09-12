const http = require("http");
const fs = require("fs");
const path = require("path");

// 정적 파일 서빙을 위한 static 함수
function static(rootDir) {
  return function (req, res) {
    const filePath = path.join(
      rootDir,
      req.url === "/" ? "/index.html" : req.url
    );

    fs.readFile(filePath, (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          res.statusCode = 404;
          res.end("404 Not Found");
        } else {
          res.statusCode = 500;
          res.end("500 Internal Server Error");
        }
      } else {
        // Content-Type을 설정 (간단히 일부 확장자만 처리)
        const ext = path.extname(filePath).toLowerCase();
        let contentType = "text/html";
        switch (ext) {
          case ".html":
            contentType = "text/html";
            break;
          case ".js":
            contentType = "text/javascript";
            break;
          case ".css":
            contentType = "text/css";
            break;
          case ".png":
            contentType = "image/png";
            break;
          default:
            contentType = "application/octet-stream";
        }

        res.statusCode = 200;
        res.setHeader("Content-Type", contentType);

        // 자바스크립트별로 응답을 지연합니다.
        const fileName = path.basename(filePath);
        if (fileName === "script-long.js") {
          setTimeout(() => {
            res.end(data);
          }, 3000);
          return;
        }

        if (fileName === "script-short.js") {
          setTimeout(() => {
            res.end(data);
          }, 1000);
          return;
        }

        if (fileName.startsWith("image")) {
          setTimeout(() => res.end(data), 1000);
          return;
        }

        if (fileName === "index-next.html") {
          res.setHeader("Cache-Control", "max-age=3600");
          setTimeout(() => res.end(data), 3000);
          return;
        }

        res.end(data);
      }
    });
  };
}

// HTTP 서버 생성
const server = http.createServer(static(path.join(__dirname, "public")));

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
