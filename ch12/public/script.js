const render = (message) => {
  const messageElement = document.createElement("div");
  const { text } = message;
  const timestamp = new Date(message.timestamp).toLocaleTimeString();
  messageElement.textContent = `${text} (${timestamp})`;
  document.body.appendChild(messageElement);
};

const init = () => {
  // todo
};
document.addEventListener("DOMContentLoaded", init);
