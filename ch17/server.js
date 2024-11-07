const http = require("http");
const path = require("path");
const static = require("../shared/serve-static");

const handler = (req, res) => {
  static(path.join(__dirname, "public"))(req, res);
};

const server = http.createServer(handler);
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`server is running ::${port}`));
