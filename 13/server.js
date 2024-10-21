/**
 * 127.0.0.1 mysite.com 레코드를 추가하세요
 */

const http = require("http");
const querystring = require("querystring");

const database = {
  products: ["Product 1", "Product 2"],
  // 세션 저장소
  session: {},
};

/**
 * 쿠키를 파싱해 객체로 반환한다.
 */
function parseCookie(req) {
  const cookies = (req.headers.cookie || "").split(";");

  const cookieObj = {};
  cookies.forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    cookieObj[decodeURIComponent(name)] = decodeURIComponent(value);
  });

  return cookieObj;
}

/**
 * HTTP 요청을 로깅한다.
 */
const log = (req, res) => {
  console.log(`${req.method} ${req.url}`);
};

/**
 * 로그인
 */
function login(req, res) {
  // 세션을 만든다.
  function createSession() {
    return `session-id-${Date.now()}`;
  }

  // 사용자를 찾는다.
  function findUser() {
    return {
      name: "Alice",
      email: "alice@email.com",
    };
  }

  // 세션 아이디를 만든다.
  const sid = createSession();
  // 인증 정보로 사용자를 찾는다.
  const user = findUser();

  // 세션 저장소에 추가한다.
  database.session = {
    [sid]: user,
  };

  res.statusCode = 301;

  // 쿠키로 세션 아이디를 전달한다.
  res.setHeader("set-cookie", `sid=${sid};`);
  // 루트 경로로 이동한다.
  // res.setHeader(Location, "/");
  // 자바스크립트로 쿠키 접근을 차단한다. (세션 하이재킹 예방)
  // res.setHeader("set-cookie", "sid=session-001; httpOnly=true;");
  // 다른 출처에서 쿠키를 차단한다. (CSRF 예방)
  // res.setHeader("set-cookie", "sid=session-001; SameSite=Strict;");

  // 응답을 보낸다.
  res.write("Login success\n");
  res.end();
}

/**
 * 로그아웃
 */
function logout(req, res) {
  // 쿠키를 파싱해 세션 아이디를 얻는다.
  const sid = parseCookie(req)["sid"] || "";

  // 세션 저장소를 지운다.
  delete database.session[sid];

  // 쿠키를 지운다.
  res.statusCode = 301;

  // sid를 지운다. 유효기간을 음수로 지정해 브라우져가 쿠키를 지울 것이다.
  res.setHeader("set-cookie", "sid=;Max-Age=-1");
  // 루트 경로로 이동한다.
  res.setHeader(Location, "/");

  // 응답을 보낸다.
  res.write("Logout success\n");
  res.end();
}

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

    res.statusCode = 302;
    res.setHeader(Location, "/");
    res.end();
  });
}

/**
 * 결재한다.
 */
function postPayment(req, res) {
  // 쿠키를 파싱해 세션 아이디를 얻는다.
  const sid = parseCookie(req)["sid"] || "";
  // 유효한 세션인지 확인한다.
  const userAccount = database.session[sid] || "";

  console.log(sid, userAccount, req.headers.cookie);
  // 인증된 요청이 아닌경우
  if (!userAccount) {
    // 401 Unauthorized
    res.statusCode = 401;
    res.write("Payment Fail\n");
    res.end();
    return;
  }

  // 인증된 요청일 경우 해당 유저로 결제한다.
  res.write(`Payment Success: ${userAccount.name}\n`);
  res.end();
}

// CSP 진단 결과를 받는다.
function report(req, res) {
  log(req, res);

  let body = "";

  req.on("data", (chunk) => {
    body = body + chunk.toString();
  });

  req.on("end", () => {
    // JSON 형태의 본문을 받는다.
    const report = JSON.parse(body);

    // 리포트를 출력합니다.
    console.log("CSP Report:", report);

    res.end();
  });
}

/**
 * HTML 문서를 응답한다.
 */
function index(req, res) {
  res.setHeader("Content-Type", "text/html");

  // 현재 출처의 자원만 사용한다.
  // res.setHeader("Content-Security-Policy", "default-src 'self';");

  // 현재 출처의 자원만 사용한다.(진단만 하고 차단하지 않음)
  // res.setHeader(
  //   "Content-Security-Policy-Report-Only",
  //   "default-src 'self'; report-uri /report"
  // );

  // 쿠키를 파싱해 세션 아이디를 얻는다.
  const sid = parseCookie(req)["sid"] || "";
  // 유효한 세션인지 확인한다.
  const userAccount = database.session[sid] || "";

  res.write(`
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
        ${userAccount ? `${userAccount.name}, ${userAccount.email}` : "Guest"}
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
  res.end();
}

const server = http.createServer((req, res) => {
  log(req, res);

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === "/login") return login(req, res);
  if (pathname === "/logout") return logout(req, res);

  if (pathname === "/product") return postProduct(req, res);
  if (pathname === "/payment") return postPayment(req, res);

  if (pathname === "/report") return report(req, res);

  return index(req, res);
});

server.listen(3000, () => {
  console.log("server is running ::3000");
});
