const fs = require("fs");
const path = require("path");

const serveStatic = (root) => {
  return (req, res) => {
    const filepath = path.join(root, req.url === "/" ? "/index.html" : req.url);

    fs.readFile(filepath, (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          res.statusCode = 404;
          res.write("Not Found\n");
          res.end();
          return;
        }

        res.statusCode = 500;
        res.write("Internal Server Error\n");
        res.end();
        return;
      }

      const ext = path.extname(filepath).toLowerCase();
      let contentType = "text/html";
      switch (ext) {
        case ".html":
          contentType = "text/html";
          break;
        case ".js":
          contentType = "text/javascript";
          break;
        case ".css":
          contentType = "text/css";
          break;
        case ".png":
          contentType = "image/png";
          break;
        case ".json":
          contentType = "application/json";
          break;
        case ".otf":
          contentType = "font/otf";
          break;
        default:
          contentType = "application/octet-stream";
      }
      res.setHeader("Content-Type", contentType);

      if (res.delayMs) {
        setTimeout(() => {
          res.write(data);
          res.end();
        }, res.delayMs);
        return;
      }
      
      res.write(data);
      res.end();
    });
  };
}

module.exports = serveStatic;