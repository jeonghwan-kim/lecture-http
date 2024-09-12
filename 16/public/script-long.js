console.log("script-long.js");

window.foo = () => console.log("foo is excuted");

performance.mark("script-long-end");
performance.measure(
  "script-long excution time",
  "script-long-start",
  "script-long-end"
);
