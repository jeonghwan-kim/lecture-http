class Downloader {
  constructor(controller) {
    this.controller = controller;
  }

  // 다운로드 버튼을 표시한다.
  render() {
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download";

    downloadButton.addEventListener("click", () => this.downloadWithAbort());

    document.body.appendChild(downloadButton);
  }
  // 취소할 수 있는 다운로드
  async downloadWithAbort() {
    try {
      // HTTP 요청 생성
      const response = await fetch("/chunk", {
        // abortSignal 객체를 전달해 취소할 수 있는 HTTP 요청을 만든다.
        signal: this.controller.signal,
      });

      // 본문 전체 길이
      const totalLength = Number(response.headers.get("content-length"));
      // 응답 본문 조각을 저장
      const chunks = [];
      // 응답 받은 본문의 누적 길이
      let receivedLength = 0;

      // 본문 조회 전용 메서드 대신 읽기 전용 스트림을 얻는다.
      const reader = response.body.getReader();

      // 다운로드가 끝날 때까지 반복
      while (true) {
        // 스트림에 도착한 데이터를 읽는다.
        const { done, value } = await reader.read();

        // 본문을 모두 다운로드하면 반복을 마친다.
        if (done) {
          this.renderResponseBody(chunks);
          break;
        }

        // 청크를 저장한다.
        chunks.push(value);
        // 응답 본문의 누적 길이를 갱신
        receivedLength += value.length;

        // 진행율을 표시한다.
        this.renderProgress(receivedLength, totalLength);
      }
    } catch (error) {
      console.error("다운로드 중 오류 발생:", error);
    }
  }

  // 다운로드 진행 상황을 화면에 표시한다.
  renderProgress(receivedLength, totalLength) {
    const gaugeEl = document.createElement("p");

    //  진행율 표시
    gaugeEl.textContent = `< ${Math.round(
      (receivedLength / totalLength) * 100
    )} % downloaded.`;

    document.body.appendChild(gaugeEl);
  }

  // 다운로드한 본문을 화면에 표시한다.
  renderResponseBody(chunks) {
    const textDecoder = new TextDecoder("utf-8");
    const responseText = chunks
      .map((chunk) =>
        //  스트림이 받은 Unit8Array을 문자열로 변환
        textDecoder.decode(chunk)
      )
      .join("");

    const el = document.createElement("pre");
    el.textContent = responseText;
    document.body.appendChild(el);
  }
}

class Aboter {
  constructor(controller) {
    this.controller = controller;
  }

  // 취소 버튼을 렌더한다.
  render() {
    // 버튼 앨리먼트
    const abortButton = document.createElement("button");
    abortButton.textContent = "abort";

    // 버튼 클릭 이벤트 핸들러 등록
    abortButton.addEventListener("click", () => {
      // 요청을 취소한다.
      this.controller.abort();

      // 취소 메세지
      const cancelMsgEl = document.createElement("p");
      cancelMsgEl.textContent = "Download is canceled.";
      document.body.appendChild(cancelMsgEl);
    });
    document.body.appendChild(abortButton);
  }
}

class Uploader {
  // 업로드 인풋을 추가한다.
  render() {
    // 파일 인풋 앨리먼트
    const uploadInput = document.createElement("input");
    uploadInput.type = "file";

    uploadInput.addEventListener("change", () => {
      this.upload(uploadInput.files[0]);
    });

    document.body.appendChild(uploadInput);
  }

  // 파일을 업로드한다.
  upload(file) {
    // 입력한 파일을 폼데이터로 구성한다.
    const formData = new FormData();
    formData.append("file", file);

    // xhr 객체를 준비한다.
    const xhr = new XMLHttpRequest();

    // 업로드 이벤트(progress)를 처리한다.
    xhr.upload.addEventListener("progress", (event) =>
      this.renderUploadProgress(event)
    );

    // 요청
    xhr.open("POST", "/upload");
    xhr.send(formData);
  }

  // 업로드 진행율을 표시한다.
  renderUploadProgress(event) {
    // 업로드 진행율
    let uploadProgress = 0;

    if (event.lengthComputable) {
      // 업로드 진행율을 갱신한다.
      uploadProgress = Math.round((event.loaded / event.total) * 100);

      // 업로드 진행율을 표시한다.
      const uploadGauge = document.createElement("p");
      uploadGauge.textContent = `> ${uploadProgress}% uploaded.`;
      document.body.appendChild(uploadGauge);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // AbortController 객체를 준비한다.
  const controller = new AbortController();

  const downloader = new Downloader(controller);
  downloader.render();

  const aborter = new Aboter(controller);
  aborter.render();

  const uploader = new Uploader();
  uploader.render();
});
