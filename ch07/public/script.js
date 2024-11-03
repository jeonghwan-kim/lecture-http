class Downloader {
  constructor(controller) {
    this.controller = controller;
  }

  render() {
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download";
    downloadButton.addEventListener("click", () => this.downloadWithAbort());
    document.body.appendChild(downloadButton);
  }

  async downloadWithAbort() {
    try {
      const response = await fetch("/chunk", {
        signal: this.controller.signal,
      });

      const totalLength = Number(response.headers.get("content-length"));
      const chunks = [];
      let receivedLength = 0;

      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          this.renderResponseBody(chunks);
          break;
        }

        chunks.push(value);
        receivedLength += value.length;

        this.renderProgress(receivedLength, totalLength);
      }
    } catch (error) {
      console.error("다운로드 중 오류 발생:", error);
    }
  }

  renderProgress(receivedLength, totalLength) {
    const gaugeEl = document.createElement("div");
    gaugeEl.textContent = `[Progress] ${receivedLength}/${totalLength} byte downloaded.\n`;
    document.body.appendChild(gaugeEl);
  }

  renderResponseBody(chunks) {
    const textDecoder = new TextDecoder("utf-8");
    const responseText = chunks
      .map((chunk) => textDecoder.decode(chunk))
      .join("");

    const el = document.createElement("div");
    el.textContent = `[Response] ${responseText}`;
    document.body.appendChild(el);
  }
}

class Aborter {
  constructor(controller) {
    this.controller = controller;
  }

  render() {
    const abortButton = document.createElement("button");
    abortButton.textContent = "abort";
    abortButton.addEventListener("click", () => {
      this.controller.abort();

      const cancelMsgEl = document.createElement("div");
      cancelMsgEl.textContent = "Download is canceled.";
      cancelMsgEl.style.color = "red";
      document.body.appendChild(cancelMsgEl);
    });
    document.body.appendChild(abortButton);
  }
}

class Uploader {
  render() {
    const uploadInput = document.createElement("input");
    uploadInput.type = "file";
    uploadInput.addEventListener("change", (event) => {
      this.upload(uploadInput.files[0]);
    });
    document.body.appendChild(uploadInput);
  }

  upload(file) {
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (event) =>
      this.renderProgress(event)
    );
    xhr.open("POST", "/upload");
    xhr.send(formData);
  }

  renderProgress(event) {
    let uploadProgress = 0;

    if (event.lengthComputable) {
      uploadProgress = Math.round((event.loaded / event.total) * 100);

      const uploadGauge = document.createElement("div");
      uploadGauge.textContent = `[Progress] ${uploadProgress}% uploaded.`;
      document.body.appendChild(uploadGauge);
    }
  }
}

const init = () => {
  const controller = new AbortController();

  const downloader = new Downloader(controller);
  downloader.render();

  const aborter = new Aborter(controller);
  aborter.render();

  const uploader = new Uploader();
  uploader.render();
};

document.addEventListener("DOMContentLoaded", init);
