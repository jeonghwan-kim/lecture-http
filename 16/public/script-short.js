console.log("script-short.js");

foo();

// 스크립트 로딩 후 종료 시각을 표시
performance.mark("script-short-end");
// 스크립트 로딩 시간을 계산
performance.measure(
  "script-short excution time",
  "script-short-start",
  "script-short-end"
);
