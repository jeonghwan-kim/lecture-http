console.log("script-long.js");

window.foo = () => console.log("foo is excuted");

// 스크립트 로딩 후 종료 시각을 표시
performance.mark("script-long-end");
// 스크립트 로딩 시간을 계산
performance.measure(
  "script-long excution time",
  "script-long-start",
  "script-long-end"
);
