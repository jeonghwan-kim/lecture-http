const pollServer = async () => {
  const INTERVAL_MS = 5000;

  const response = await fetch("/poll");

  if (response.status === 204) {
    setTimeout(pollServer, INTERVAL_MS);
    return;
  }

  const message = await response.json();
  render(message);

  setTimeout(pollServer, INTERVAL_MS);
};

const render = (message) => {
  const messageElement = document.createElement("div");
  const { text } = message;
  const timestamp = new Date(message.timestamp).toLocaleTimeString();
  messageElement.textContent = `${text} (${timestamp})`;
  document.body.appendChild(messageElement);
};

const init = () => {
  pollServer();
};
document.addEventListener("DOMContentLoaded", init);
