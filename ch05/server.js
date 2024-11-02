const http = require("http");
const path = require("path");
const querystring = require("querystring");
const static = require("../shared/serve-static");

const logRequest = (req) => {
  const log = [
    `${new Date().toISOString()}`,
    `IP: ${req.socket.remoteAddress || req.connection.remoteAddress}`,
    `User-Agent: ${req.headers["user-agent"]}`,
    `Referer: ${req.headers["referer"]}`,
  ].join(", ");
  console.log(log);
};

const getLogin = (req, res) => {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const email = searchParams.get("email");
  const password = searchParams.get("password");

  const authenticated = email === "myemail" && password === "mypassword";

  if (!authenticated) {
    res.statudCode = 401;
    res.write("Unauthorized\n");
    res.end();
    return;
  }

  res.write("Success\n");
  res.end();
};

const postLogin = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body = body + chunk.toString();
  });

  req.on("end", () => {
    const { email, password } = querystring.parse(body);
    const authenticated = email === "myemail" && password === "mypassword";

    if (!authenticated) {
      res.statuscode = 401;
      res.write("Unauthorized\n");
      res.end();
      return;
    }

    res.write("Success\n");
    res.end();
  });
};

const handler = (req, res) => {
  let { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === "/tracking-pixel.gif") logRequest(req);

  if (pathname === "/login") return postLogin(req, res);

  static(path.join(__dirname, "public"))(req, res);
};

const server = http.createServer(handler);
server.listen(3000, () => console.log("server is running ::3000"));
