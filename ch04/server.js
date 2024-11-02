const http = require("http");

const handler = (req, res) => {
  const cookie = req.headers["cookie"];
  if (cookie && cookie.includes("sid")) {
    res.write("Welcome again.\n");
    res.end();
    return;
  }

  res.setHeader("Set-Cookie", "sid=1; Domain=mysite.com;");
  res.write("Welcome.\n");
  res.end();
};

const server = http.createServer(handler);
server.listen(3000, () => console.log("server is running ::3000"));
