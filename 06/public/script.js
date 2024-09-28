async function handleSubmit(event) {
  // 폼 기본 동작을 중단합니다.
  // 브라우져가 화면을 리프레시하지 않고 이후 코드를 실행할 거에요.
  event.preventDefault();

  // multipart/form-data 형식
  const formData = new FormData(event.target);

  // application/x-www-forn-urlencoded 방식
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append("email", formData.get("email"));
  urlSearchParams.append("password", formData.get("password"));

  // application/json 방식
  const json = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    // fetch 함수를 사용합니다.
    const response = await fetch("/login", {
      // POST 메소드를 사용합니다.
      method: "POST",
      headers: {
        // content-type 헤더를 지정했습니다.
        // urlencoded 방식으로 실을 겁니다.
        // "Content-Type": "application/x-www-form-urlencoded",
        //  json 형식으로 요청 본문을 실을 겁니다.
        "Content-Type": "application/json",
      },
      // 요청 본문을 실었습니다.
      // body: formData,
      // email과 password로 구성된 객체를 json 문자열로 변환했어요.
      // body: urlSearchParams.toString(),
      body: JSON.stringify(json),
    });

    // 오류 처리
    if (!response.ok) {
      alert("API Error");
      return;
    }

    // 성공 처리
    const body = await response.json();
    alert("Success: " + body.authenticated);
  } catch (error) {
    // HTTP가 아닌 오류 처리
    alert("Network Error");
  }
}

function init() {
  const loginForm = document.querySelector("#login-form");
  if (!loginForm) throw "no #login-form";

  loginForm.addEventListener("submit", handleSubmit);
}

document.addEventListener("DOMContentLoaded", init);
