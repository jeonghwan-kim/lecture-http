/**
 * 127.0.0.1 mysite.com 레코드를 추가하세요
 */

const http = require("http");
const querystring = require("querystring");
/**
 * HTTP 요청을 로깅한다.
 */
const log = (req, res) => {
  console.log(`${req.method} ${req.url}`);
};

const database = {
  products: ["Product 1", "Product 2"],
  session: {
    "session-001": {
      name: "Alice",
      email: "alice@email.com",
    },
  },
};

function postProduct(req, res) {
  // 요청 본문을 담을 변수
  let body = "";
  // 요청 본문이 도착할 때마다 청크를 모은다.
  req.on("data", (chunk) => {
    body = body + chunk.toString();
  });
  // 요청 본문이 모두 도착할 경우
  req.on("end", () => {
    const { product } = querystring.parse(body);
    database.products.push(product);

    res.writeHead(302, {
      Location: "/",
    });
    res.end();
  });
}

function index(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/html",
    "set-cookie": "sid=session-001;",
    // 자바스크립트로 쿠키 접근을 차단한다. (세션 하이재킹 예방)
    // "set-cookie": "sid=my-sid; httpOnly=true;",
    // 다른 출처에서 쿠키를 차단한다. (CSRF 예방)
    // "set-cookie": "sid=session-001; SameSite=Strict;",
    // 현재 출처의 자원만 사용하라.
    // "Content-Security-Policy": "default-src 'self';",
    // "Content-Security-Policy-Report-Only":
    // "default-src 'self'; report-uri /report",
  });

  const cookies = (req.headers.cookie || "").split(";");
  console.log("cookie", req.headers.cookie);
  const cookieObj = {};
  cookies.forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    cookieObj[decodeURIComponent(name)] = decodeURIComponent(value);
  });

  const sid = cookieObj["sid"] || "";
  const userAccount = database.session[sid] || "";

  // console.log(userAccount);

  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          @font-face {
              font-family: 'MyCustomFont';
              src: url('http://other-origin.com/MyCustomFont.woff2');
          }
              
        </style>
      </head>
      <body style="font-family: 'MyCustomFont'">
        ${userAccount ? `${userAccount.name}, ${userAccount.email}` : ""}
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
}

function report(req, res) {
  log(req, res);

  let body = "";
  req.on("data", (chunk) => {
    body = body + chunk.toString();
  });
  req.on("end", () => {
    const report = JSON.parse(body);
    console.log("CSP Report:", report);
    res.end();
  });
}

const server = http.createServer((req, res) => {
  log(req, res);

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === "/product") return postProduct(req, res);
  if (pathname === "/report") return report(req, res);

  return index(req, res);
});

server.listen(3000, () => {
  console.log("server is running ::3000");
});
