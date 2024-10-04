(async () => {
  // resource.json을 요청한다.
  const res = await fetch("http://localhost:3001/resource.json", {
    headers: {
      // 안전하지 않은 헤더를 사용한다.
      "X-Foo": "foo",
    },
    // 안전하지 않은 메소드를 사용한다.
    method: "PUT",
  });

  // 서버가 응답한 파일 내용을 기록할 것이다.
  const data = await res.text();
  const jsonEl = document.createElement("pre");
  jsonEl.textContent = data;
  document.body.appendChild(jsonEl);
})();
