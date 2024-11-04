const http = require("http");

const csrf = (req, res) => {
  res.setHeader("Content-Type", "text/html");

  res.write(`
    <!DOCTYPE html>
    <html>
      <head></head>
      <body>
        CSRF
        <img src="http://mysite.com:3000" />
      </body>
    </html>
  `);
  res.end();
};

const server = http.createServer((req, res) => {
  csrf(req, res);
});

server.listen(3002, () => console.log("server is running ::3002"));
