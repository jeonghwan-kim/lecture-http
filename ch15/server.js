const https = require("https");
const fs = require("fs");
const path = require("path");

const options = {
  key: fs.readFileSync(path.join(__dirname, "./server.key")),
  cert: fs.readFileSync(path.join(__dirname, "./server.cert")),
};

const handler = (req, res) => {
  res.write("Hello\n");
  res.end();
};

const server = https.createServer(options, handler);
server.listen(3000, () => console.log("server is running ::3000"));
