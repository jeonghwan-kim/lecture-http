const http = require("http");
const fs = require("fs");
const path = require("path");
const static = require("../shared/serve-static");

// 정적 파일 서빙을 위한 static 함수
function DEPRECATED_static(rootDir) {
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
const server = http.createServer((req, res) => {
  const fileName = path.basename(req.url);
  console.log(fileName);

  // 3초 지연 응답
  if (fileName === "script-long.js") {
    res.delayMs = 3000;
  }

  // 1초 지연 응답
  if (fileName === "script-short.js") {
    res.delayMs = 1000;
  }

  // 이미지 1초 지연 응답
  if (fileName === "image.png") {
    res.delayMs = 1000;
  }

  // next.html 페이지 3초 지연 응답
  if (fileName === "index-next.html") {
    // 3초정도 지연해서 응답했습니다. 그만큼 무거운 자원이라는 것을 흉내낸 것입니다.
    res.delayMs = 3000;

    // 프리패치 동작을 고려해 캐시 콘트롤 헤더도 실었습니다.
    // (크롬은 없이도 잘됨. 파이어폭스는 설정해야함.)
    // 참고: https://github.com/withastro/astro/issues/10464#issuecomment-2004349379
    res.setHeader("Cache-Control", "max-age=3600");
  }

  static(path.join(__dirname, "public"))(req, res);
});

// 환경변수 PORT에서 포트 번호를 가져온다. 기본값은 3000
const port = process.env.PORT || 3000;
// 해당 포트에서 요청을 기다린다.
server.listen(port, () => {
  console.log(`server is running ::${port}`);
});
