let eventSource;

function subscribe() {
  // EventSource 생성자에 구독할 URL을 전달해 eventSoruce 객체를 만들었습니다.
  // EventSource 로 서버와 연결되면 브라우져는 앞으로 서버가 보낼 이벤트를 받을 준비가 된 것입니다.
  eventSource = new EventSource("/subscribe");

  // eventSource.addEventListener("open", () => {
  //   console.log("open");
  // });

  // eventSource.addEventListener("error", (e) => {
  //   console.log(`error: ${e}`, e.target);

  //   if (this.readyState == EventSource.CONNECTING) {
  //     console.log(`Reconnecting (readyState=${this.readyState})...`);
  //   } else {
  //     console.log("Error has occured.");
  //   }
  // });

  // 서버에서 이벤트를 보내면 "message" 이벤트가 발생합니다.
  // eventSource 객체는 이 이벤트를 지켜보고 있다가 이벤트 객체를 통해 알림을 받을 수 있습니다.
  eventSource.addEventListener("message", function (e) {
    // 서버에서 보낸 이벤트의 data 필드 값은 브라우져에서 발생한 이벤트 객체의 data 필드에 있습니다.
    // 이걸 render 함수로 전달해 화면에 렌더합니다.
    render(JSON.parse(e.data));
  });
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
document.addEventListener("DOMContentLoaded", subscribe);
