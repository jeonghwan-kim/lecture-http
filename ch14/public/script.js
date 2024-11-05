const init = async () => {
  const res = await fetch("http://localhost:3001/resource.json", {
    headers: {
      // 안전하지 않은 헤더를 사용한다.
      "X-Foo": "foo",
    },
    method: "PUT",
  });

  const data = await res.text();
  const jsonEl = document.createElement("pre");
  jsonEl.textContent = data;
  document.body.appendChild(jsonEl);
};
document.addEventListener("DOMContentLoaded", init);
