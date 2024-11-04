const subscribe = () => {
  eventSource = new EventSource("/subscribe");
  eventSource.addEventListener("message", function (e) {
    render(JSON.parse(e.data));
  });
};

const render = (message) => {
  const messageElement = document.createElement("div");
  const { text } = message;
  const timestamp = new Date(message.timestamp).toLocaleTimeString();
  messageElement.textContent = `${text} (${timestamp})`;
  document.body.appendChild(messageElement);
};

const init = () => {
  subscribe();
};
document.addEventListener("DOMContentLoaded", init);
