document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#login-form");

  loginForm.addEventListener("submit", async (event) => {
    // 폼 기본 동작을 중단한다.
    event.preventDefault();

    const formData = new FormData(event.target);

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      if (!response.ok) {
        alert("API Error");
        return;
      }

      // http 성공 처리
      const body = await response.json();
      alert(body.authenticated);
    } catch (error) {
      // http가 아닌 오류 처리
      alert("Network Error");
    }
  });
});
