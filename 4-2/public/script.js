/**
 * 지속적으로 서버 자원을 조회한다.
 */
async function longPollServer() {
  const response = await fetch("/longpoll");

  // 타임아웃이 발생하면 다시 연결한다.
  if (response.status === 408) {
    longPollServer();
    return;
  }

  // 새로운 데이터 수신
  const message = await response.json();
  render(message);

  // 즉시 다시 요청한다.
  longPollServer();
}

function render(message) {
  const messageElement = document.createElement("p");
  messageElement.textContent = `${message.text} (${new Date(
    message.timestamp
  ).toLocaleTimeString()})`;

  const appEl = document.querySelector("#app");
  appEl.appendChild(messageElement);
}

document.addEventListener("DOMContentLoaded", longPollServer);
