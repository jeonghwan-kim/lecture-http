/**
 * 주기적으로 서버 자원을 조회한다.
 */
async function pollServer() {
  const INTERVAL_MS = 5000;

  const response = await fetch("/poll");

  // 변경 없는 경우, 다시 연결한다.
  if (response.status === 204) {
    setTimeout(pollServer, INTERVAL_MS);
    return;
  }

  // 새로운 데이터 수신
  const message = await response.json();
  render(message);

  // 5초후 다시 요청한다.
  // 즉시 요청하면 서버에 부가를 줄 것이다.
  setTimeout(pollServer, INTERVAL_MS);
}

function render(message) {
  const messageElement = document.createElement("p");
  messageElement.textContent = `${message.text} (${new Date(
    message.timestamp
  ).toLocaleTimeString()})`;

  const appEl = document.querySelector("#app");
  appEl.appendChild(messageElement);
}

document.addEventListener("DOMContentLoaded", pollServer);
