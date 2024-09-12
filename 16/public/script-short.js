console.log("script-short.js");

foo();

performance.mark("script-short-end");
performance.measure(
  "script-short excution time",
  "script-short-start",
  "script-short-end"
);
