const http = require("http");
const path = require("path");
const static = require("../shared/serve-static");

const handleLogin = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body = body + chunk.toString();
  });

  req.on("end", () => {
    const { email, password } = JSON.parse(body);
    const authenticated = email === "myemail" && password === "mypassword";

    res.statusCode = authenticated ? 200 : 401;
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify({ authenticated }));
    res.end();
  });
};

const handler = (req, res) => {
  let { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === "/login") return handleLogin(req, res);

  static(path.join(__dirname, "public"))(req, res);
};

const server = http.createServer(handler);

server.listen(3000, () => console.log("server is running ::3000"));
