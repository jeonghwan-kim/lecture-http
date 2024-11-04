class Message {
  constructor(text) {
    this.text = text;
    this.timestamp = Date.now();
  }

  toString() {
    return JSON.stringify({
      text: this.text,
      timestamp: this.timestamp,
    });
  }
}

module.exports = Message;
