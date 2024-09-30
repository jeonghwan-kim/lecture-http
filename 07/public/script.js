// 취소할 수 있는 다운로드
async function downloadChunkWithAbort(controller) {
  try {
    // HTTP 요청 생성
    const response = await fetch("/chunk", {
      // abortSignal 객체를 전달해 취소할 수 있는 HTTP 요청을 만든다.
      signal: controller.signal,
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
        renderResponseBody(chunks);
        break;
      }

      // 청크를 저장한다.
      chunks.push(value);
      // 응답 본문의 누적 길이를 갱신
      receivedLength += value.length;

      // 진행율을 표시한다.
      renderProgress(receivedLength, totalLength);
    }
  } catch (error) {
    console.error("다운로드 중 오류 발생:", error);
  }
}

// 다운로드 진행 상황을 화면에 표시한다.
function renderProgress(receivedLength, totalLength) {
  const gaugeEl = document.createElement("p");

  //  진행율 표시
  gaugeEl.textContent = `${receivedLength}/${totalLength} byte downloaded.`;

  document.body.appendChild(gaugeEl);
}

// 다운로드한 본문을 화면에 표시한다.
function renderResponseBody(chunks) {
  const textDecoder = new TextDecoder("utf-8");
  const responseText = chunks
    .map((chunk) =>
      //  스트림이 받은 Unit8Array을 문자열로 변환
      textDecoder.decode(chunk)
    )
    .join("");

  const el = document.createElement("p");
  el.textContent = responseText;
  document.body.appendChild(el);
}

// 취소 버튼을 렌더한다.
function renderAbortButton(controller) {
  // 버튼 앨리먼트
  const abortButton = document.createElement("button");
  abortButton.textContent = "abort";

  // 버튼 클릭 이벤트 핸들러 등록
  abortButton.addEventListener("click", () => {
    // 요청을 취소한다.
    controller.abort();

    // 취소 메세지
    const cancelMsgEl = document.createElement("p");
    cancelMsgEl.textContent = "Download is canceled.";
    document.body.appendChild(cancelMsgEl);
  });
  document.body.appendChild(abortButton);
}

document.addEventListener("DOMContentLoaded", () => {
  // AbortController 객체를 준비한다.
  const controller = new AbortController();

  downloadChunkWithAbort(controller);
  renderAbortButton(controller);
});
