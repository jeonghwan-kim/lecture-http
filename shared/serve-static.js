const fs = require("fs");
const path = require("path");

module.exports = serveStatic;

// 요청한 경로의 정적 파일을 응답하는 함수
function serveStatic(root) {
  return function serveStatic(req, res) {
    // 요청한 파일의 경로를 계산합니다.
    const filepath = path.join(root, req.url === "/" ? "/index.html" : req.url);

    // 파일 정보를 읽는다.
    fs.stat(filepath, (err, stat) => {
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

      // 파일 수정 시간과 크기로 etag 값을 만든다.
      const etag = `${stat.mtime.getTime().toString(16)}-${stat.size.toString(
        16
      )}`;
      // 파일 수정 시간을 읽는다.
      const modified = stat.mtime;

      if (req.headers["if-none-match"]) {
        // 요청 헤더에서 태그를 조회한다.
        const noneMatch = req.headers["if-none-match"];

        // 파일의 etag 값과 비교한다.
        const isFresh = noneMatch === etag;

        // etag 값이 같으면
        if (isFresh) {
          // TODO: redirect(res)
          // 응답 헤더에 `304 Not Modified` 상태 코드를 실습니다.
          res.writeHead(304);
          // 파일을 다시 제공할 필요가 없습니다. 본문은 비워서 작고 빠르게 응답합니다.
          res.end();
          return;
        }
      }

      // 시간 기반 캐싱: If-Modified-Since 헤더가 있는 경우
      if (req.headers["if-modified-since"]) {
        // 요청 헤더에서 수정일을 조회한다.
        const modifiedSince = new Date(req.headers["if-modified-since"]);

        // 파일 수정일과 비교한다.
        const isFresh = !(
          Math.floor(modifiedSince.getTime() / 1000) <
          Math.floor(modified.getTime() / 1000)
        );

        // 수정일이 같을 경우
        // 요청한 파일 수정일이 서버 파일의 수정일과 같다면 변경되지 않았다고 판답합니다.
        if (isFresh) {
          // 응답 헤더에 `304 Not Modified` 상태 코드를 실습니다.
          res.writeHead(304);
          // 파일을 다시 제공할 필요가 없습니다. 본문은 비워서 작고 빠르게 응답합니다.
          res.end();
          return;
        }
      }

      // 파일 해시값을 응답 헤더이 실는다.
      res.setHeader("ETag", etag);
      // 파일 수정 시간을 응답 헤더에 실는다.
      res.setHeader("Last-Modified", modified.toUTCString());

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
        res.setHeader("Content-Type", contentType);

        if (ext === ".js") {
          // 자바스크립트면 1년간 캐시한다
          res.setHeader("Cache-Control", "max-age=31536000");
        } else if (ext === ".html") {
          // HTML이면 캐시 유효성을 매번 확인한다.
          res.setHeader("Cache-Control", "no-cache");
        } else {
          // 다른 파일은 설정하지 않는다.
        }

        // delayMs가 설정된 경우 그 시간만큼 지연 응답한다.
        if (res.delayMs) {
          setTimeout(() => {
            res.end(data);
          }, res.delayMs);
          return;
        }

        // 파일 내용을 본문에 실어 응답한다.
        res.writeHead(200);
        res.end(data);
      });
    });
  };
}
