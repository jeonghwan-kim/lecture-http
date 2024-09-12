const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

/**
 * 로그인 컨트롤러
 * POST 메소드 요청을 처리한다.
 */
function postLoginController(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body = body + chunk.toString();
  });
  req.on("end", () => {
    const { email, password } = JSON.parse(body);
    const authenticated = email === "myemail" && password === "mypassword";

    res.writeHead(authenticated ? 200 : 401, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ authenticated }));
  });
}

function handler(req, res) {
  let { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === "/login") {
    postLoginController(req, res);
    return;
  }

  const filename = pathname.replace(/^\//, "") || "index.html";
  const filepath = path.resolve(__dirname, "public", filename);
  fs.readFile(filepath, (err, data) => {
    if (err) {
      console.error(err);
      res.end("Error");
      return;
    }

    res.end(data);
  });
}

const server = http.createServer(handler);

server.listen(3000, () => {
  console.log("server is running ::3000");
});
