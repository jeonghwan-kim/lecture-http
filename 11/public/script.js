let eventSource;

function subscribe() {
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

  // 메세지를 수신하면 화면에 출력한다.
  eventSource.addEventListener("message", function (e) {
    render(JSON.parse(e.data));
  });
}

function render(message) {
  const messageElement = document.createElement("p");
  messageElement.textContent = `${message.text} (${new Date(
    message.timestamp
  ).toLocaleTimeString()})`;

  const appEl = document.querySelector("#app");
  appEl.appendChild(messageElement);
}

document.addEventListener("DOMContentLoaded", subscribe);
