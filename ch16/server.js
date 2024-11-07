const http = require("http");
const path = require("path");
const static = require("../shared/serve-static");

const handler = (req, res) => {
  const fileName = path.basename(req.url);

  if (fileName === "script-big.js") res.delayMs = 3000;
  if (fileName === "script-small.js") res.delayMs = 1000;
  if (fileName === "cat.jpg") res.delayMs = 1000;
  if (fileName === "dog.jpg") res.delayMs = 1000;
  if (fileName === "index-next.html") {
    res.delayMs = 3000;
    res.setHeader("Cache-Control", "max-age=3600");
  }

  static(path.join(__dirname, "public"))(req, res);
};

const server = http.createServer(handler);
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`server is running ::${port}`));
