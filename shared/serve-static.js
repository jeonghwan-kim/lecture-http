const fs = require("fs");
const path = require("path");

const serveStatic = (root) => {
  return (req, res) => {
    const filepath = path.join(root, req.url === "/" ? "/index.html" : req.url);

    fs.stat(filepath, (err, stat) => {
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

      const etag = `${stat.mtime.getTime().toString(16)}-${stat.size.toString(
        16
      )}`;
      const modified = stat.mtime;

      if (req.headers["if-none-match"]) {
        const noneMatch = req.headers["if-none-match"];

        const isFresh = noneMatch === etag;
        if (isFresh) {
          res.writeHead(304);
          res.end();
          return;
        }
      }

      if (req.headers["if-modified-since"]) {
        const modifiedSince = new Date(req.headers["if-modified-since"]);

        const isFresh = !(
          Math.floor(modifiedSince.getTime() / 1000) <
          Math.floor(modified.getTime() / 1000)
        );

        if (isFresh) {
          res.writeHead(304);
          res.end();
          return;
        }
      }

      res.setHeader("ETag", etag);
      res.setHeader("Last-Modified", modified.toUTCString());

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

        if (ext === ".js") {
          res.setHeader("Cache-Control", "max-age=31536000");
        } else if (ext === ".html") {
          res.setHeader("Cache-Control", "no-cache");
        } else {
          // 다른 파일은 설정하지 않는다.
        }

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
    });


  };
}

module.exports = serveStatic;