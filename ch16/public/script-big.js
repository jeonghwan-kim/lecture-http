console.log("script-big.js");

window.foo = () => console.log("foo is excuted");

performance.mark("script-big-end");
performance.measure(
  "script-big excution time",
  "script-big-start",
  "script-big-end"
);
