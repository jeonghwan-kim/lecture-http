const fs = require("fs");
const path = require("path");

module.exports = serveStatic;

// 요청한 경로의 정적 파일을 응답하는 함수
function serveStatic(root) {
  return function serveStatic(req, res) {
    // 요청한 파일의 경로를 계산합니다.
    const filepath = path.join(root, req.url === "/" ? "/index.html" : req.url);

    // 파일을 읽는다.
    fs.readFile(filepath, (err, data) => {
      if (err) {
        // 오류처리: 파일이 없는 경우
        if (err.code === "ENOENT") {
          res.writeHead(404);
          res.end("Not Found");
          return;
        }

        // 오류 처리: 파일 읽기 실패
        res.writeHead(500);
        res.end("Internal Server Error");
        return;
      }

      // Content-Type을 설정 (간단히 일부 확장자만 처리)
      const ext = path.extname(filepath).toLowerCase();
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
        case ".json":
          contentType = "application/json";
          break;
        case ".otf":
          contentType = "font/otf";
          break;
        default:
          contentType = "application/octet-stream";
      }
      res.writeHead(200, {
        "Content-Type": contentType,
      });

      // delayMs가 설정된 경우 그 시간만큼 지연 응답한다.
      if (res.delayMs) {
        setTimeout(() => {
          res.end(data);
        }, res.delayMs);
        return;
      }

      // 파일 내용을 본문에 실어 응답한다.
      res.end(data);
    });
  };
}
