console.log("script-small.js");

foo();

performance.mark("script-small-end");
performance.measure(
  "script-small excution time",
  "script-small-start",
  "script-small-end"
);

