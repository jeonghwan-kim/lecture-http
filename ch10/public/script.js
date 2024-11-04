const longPollServer = async () => {
  const response = await fetch("/longpoll");

  if (response.status === 408) {
    longPollServer();
    return;
  }

  const message = await response.json();
  render(message);

  longPollServer();
};

const render = (message) => {
  const messageElement = document.createElement("div");
  const { text } = message;
  const timestamp = new Date(message.timestamp).toLocaleTimeString();
  messageElement.textContent = `${text} (${timestamp})`;
  document.body.appendChild(messageElement);
};

const init = () => {
  longPollServer();
};
document.addEventListener("DOMContentLoaded", init);
