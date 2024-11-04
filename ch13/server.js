const http = require("http");
const querystring = require("querystring");

const database = {
  products: ["Product 1", "Product 2"],
  session: {},
};

const parseCookie = (req) => {
  const cookies = (req.headers.cookie || "").split(";");

  const cookieObj = {};
  cookies.forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    cookieObj[decodeURIComponent(name)] = decodeURIComponent(value);
  });

  return cookieObj;
};

const login = (req, res) => {
  const createSession = () => `session-id-${Date.now()}`;

  const findUser = () => ({
    name: "Alice",
    email: "alice@email.com",
  });

  const sid = createSession();
  const user = findUser();

  database.session = {
    [sid]: user,
  };

  res.statusCode = 301;
  res.setHeader("Location", "/");
  res.setHeader("set-cookie", `sid=${sid};`);
  res.end();
};

const logout = (req, res) => {
  const sid = parseCookie(req)["sid"] || "";
  delete database.session[sid];

  res.statusCode = 301;
  res.setHeader("set-cookie", "sid=;Max-Age=-1");
  res.setHeader("Location", "/");
  res.end();
};

const postProduct = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body = body + chunk.toString();
  });

  req.on("end", () => {
    const { product } = querystring.parse(body);

    database.products.push(product);

    res.statusCode = 302;
    res.setHeader("Location", "/");
    res.end();
  });
};

const report = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body = body + chunk.toString();
  });

  req.on("end", () => {
    const report = JSON.parse(body);
    console.log("CSP Report:", report);

    res.end();
  });
};

const index = (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader(
    "Content-Security-Policy-Report-Only",
    "default-src 'self'; report-uri /report"
  );

  const sid = parseCookie(req)["sid"] || "";
  const userAccount = database.session[sid] || "";

  res.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>input {width: 600px;}</style>
      </head>
      <body>
        ${userAccount ? `${userAccount.name}, ${userAccount.email}` : "Guest"}
        <form method="POST" action="/product">
          <input name="product" type="text" />
          <button type="submit">Add</button>
        </form>

        <ul>
          ${database.products.map((product) => `<li>${product}</li>`).join("")}
        </ul>
      </body>
    </html>
  `);
  res.end();
};

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === "/login") return login(req, res);
  if (pathname === "/logout") return logout(req, res);
  if (pathname === "/product") return postProduct(req, res);
  if (pathname === "/report") return report(req, res);

  index(req, res);
});

server.listen(3000, () => console.log("server is running ::3000"));
