const http = require("http");
const path = require("path");
const static = require("../shared/serve-static");

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
