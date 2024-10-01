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

/**
 * 메세지 객체를 화면에 출력한다.
 */
function render(message) {
  // p 앨리먼트를 만들어
  const messageElement = document.createElement("p");

  // 출력할 텍스트와 시간을 준비한다.
  const { text } = message;
  const timestamp = new Date(message.timestamp).toLocaleTimeString();

  // 앨리먼트에 출력한다.
  messageElement.textContent = `${text} (${timestamp})`;
  document.body.appendChild(messageElement);
}

document.addEventListener("DOMContentLoaded", longPollServer);
