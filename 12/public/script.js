let webSocket;

function subscribe() {
  webSocket = new WebSocket("ws://" + location.host);

  webSocket.addEventListener("message", (event) => {
    console.log("message:", event.data, event);
    render(JSON.parse(event.data));
  });

  setTimeout(() => {
    // webSocket.send("Hello");
  }, 3000);
}

function render(message) {
  const messageElement = document.createElement("p");
  messageElement.textContent = `${message.text} (${new Date(
    message.timestamp
  ).toLocaleTimeString()})`;

  const messageEl = document.querySelector("#messages");
  messageEl.appendChild(messageElement);
}

function initSendButton() {
  const sendButtonEl = document.querySelector("#send-button");
  sendButtonEl.addEventListener("click", () => {
    const textFieldEl = document.querySelector("#text-field");
    const textValue = textFieldEl.value;
    if (!textValue) return;

    console.log(textValue);
    textFieldEl.value = "";

    if (!webSocket) return;

    webSocket.send(textValue);
  });
}

function init() {
  subscribe();
  initSendButton();
}

document.addEventListener("DOMContentLoaded", init);
