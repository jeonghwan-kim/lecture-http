/**
 * 서버와 연결된 웹소켓 인스턴스
 */
let webSocket;

/**
 * 웹소켓 인스턴스를 초기화
 */
function subscribe() {
  // 서버와 웹소켓 핸드쉐이킹한다.
  webSocket = new WebSocket("ws://" + location.host);

  // 서버에서 메세지를 받은 경우
  webSocket.addEventListener("message", (event) => {
    console.log("message:", event.data, event);

    // 받은 메세지를 화면에 출력한다.
    render(JSON.parse(event.data));
  });

  setTimeout(() => {
    // webSocket.send("Hello");
  }, 3000);
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

/**
 * 전송 버튼을 초기화한다.
 */
function initSendButton() {
  // 전송 버튼
  const sendButtonEl = document.querySelector("#send-button");

  // 클릭 이벤트 핸들러 등록
  sendButtonEl.addEventListener("click", () => {
    // 입력한 메세지
    const textFieldEl = document.querySelector("#text-field");
    const textValue = textFieldEl.value;
    if (!textValue) return;

    // 필드에 입력값을 비움
    textFieldEl.value = "";

    if (!webSocket) return;

    // 입력한 메세지를 서버로 전송
    webSocket.send(textValue);
  });
}

function init() {
  subscribe();
  initSendButton();
}

document.addEventListener("DOMContentLoaded", init);
