const https = require("https");

const options = {};

const handler = (req, res) => {
  res.write("Hello\n");
  res.end();
};

const server = https.createServer(options, handler);
server.listen(3000, () => console.log("server is running ::3000"));
