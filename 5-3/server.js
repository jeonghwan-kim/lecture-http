const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("./server.key"),
  cert: fs.readFileSync("./server.cert"),
};

const requestHandler = (req, res) => {
  res.write("Hello");
  res.end();
};

const server = https.createServer(options, requestHandler);

server.listen(3000, () => {
  console.log("server is running ::3000");
});
