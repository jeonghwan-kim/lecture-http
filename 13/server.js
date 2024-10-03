/**
 * 127.0.0.1 mysite.com 레코드를 추가하세요
 */

const http = require("http");
const querystring = require("querystring");

const database = {
  products: ["Product 1", "Product 2"],
  session: {
    // 세션을 생성한다.
    "session-001": {
      name: "Alice",
      email: "alice@email.com",
    },
  },
};

/**
 * HTTP 요청을 로깅한다.
 */
const log = (req, res) => {
  console.log(`${req.method} ${req.url}`);
};

/**
 * 상품을 추가한다.
 */
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

    // 이스케이프 처리
    // const escapedProduct = product.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // database.products.push(escapedProduct);

    res.writeHead(302, {
      Location: "/",
    });
    res.end();
  });
}

// 쿠키를 파싱해 객체로 반환한다.
function parseCookie(req) {
  const cookies = (req.headers.cookie || "").split(";");

  const cookieObj = {};
  cookies.forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    cookieObj[decodeURIComponent(name)] = decodeURIComponent(value);
  });

  return cookies;
}

function index(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/html",

    // 쿠키로 세션 아이디를 전달한다.
    "set-cookie": "sid=session-001;",

    // 자바스크립트로 쿠키 접근을 차단한다. (세션 하이재킹 예방)
    "set-cookie": "sid=my-sid; httpOnly=true;",

    // 다른 출처에서 쿠키를 차단한다. (CSRF 예방)
    // "set-cookie": "sid=session-001; SameSite=Strict;",
    // 현재 출처의 자원만 사용하라.
    // "Content-Security-Policy": "default-src 'self';",
    // "Content-Security-Policy-Report-Only":
    // "default-src 'self'; report-uri /report",
  });

  // 쿠키를 파싱해 세션 아이디를 얻는다.
  const sid = parseCookie(req)["sid"] || "";
  // 유효한 세션인지 확인한다.
  const userAccount = database.session[sid] || "";

  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          @font-face {
              font-family: 'MyCustomFont';
              src: url('http://other-origin.com/MyCustomFont.woff2');
          }
              
        </style>
      </head>
      <body style="font-family: 'MyCustomFont'">
        ${userAccount ? `${userAccount.name}, ${userAccount.email}` : ""}
        <!--  1. 사용자가 텍스트를 입력할 수 있는 폼. 텍스트를 입력하면 서버에 전달됩니다. -->
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
