const http = require("http");
const path = require("path");
const fs = require("fs");

const static = (req, res) => {
  const filepath = path.join(__dirname, "public", req.url);

  fs.readFile(filepath, (err, data) => {
    if (err) {
      res.write("Not Found\n");
      res.end();
      return;
    }

    res.write(data);
    res.end();
  });
};
const handler = (req, res) => static(req, res);

const server = http.createServer(handler);
server.listen(3000, () => console.log("server is running ::3000"));
