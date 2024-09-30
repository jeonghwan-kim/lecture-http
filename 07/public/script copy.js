// 다운받은 진행율을 표시한다.
const renderProgress = (receivedLength, totalLength) => {
  const el = document.createElement("pre");
  el.textContent = `${receivedLength}/${totalLength} byte downloaded.`;
  document.body.appendChild(el);
};

const renderResponeBody = (chunks) => {
  const textDecoder = new TextDecoder("utf-8");
  const textList = [];
  for (const chunk of chunks) {
    // 스트림이 받은 Unit8Array을 문자열로 변환한다.
    textList.push(textDecoder.decode(chunk));
  }

  const el = document.createElement("div");
  el.textContent = textList.join("");
  document.body.appendChild(el);
};

document.addEventListener("DOMContentLoaded", async () => {
  // AbortController 객체를 준비한다.
  const controller = new AbortController();
  // abortSignal 객체에 취소(abort) 이벤트 처리기를 붙인다.
  controller.signal.addEventListener("abort", () =>
    console.log("abort 이벤트 수신함")
  );
  // 취소 버튼
  const abortButton = document.querySelector("#abort-button");
  abortButton.addEventListener("click", async () => {
    // 요청을 취소한다.
    controller.abort();
  });

  let response;

  // http 요청을 생성한다
  try {
    response = await fetch("/chunk", {
      // abortSignal 객체를 전달해 fetch를 실행한다.
      signal: controller.signal,
    });
  } catch (e) {
    console.error(e);
  }

  // 본문의 전체 길이를 구한다.
  const totalLength = Number(response.headers.get("content-length"));
  // 응답 본문 청크를 저장할 것이다.
  const chunks = [];
  // 응답 받을 때 다 본문의 누적 길이다.
  let receivedLength = 0;

  // 본문 조회 전용 메서드 대신
  // 읽기 전용 스트림을 얻는다.
  const reader = response.body.getReader();

  // 본문이 끝날 때까지 반복한다.
  while (true) {
    // 스트림에 도착한 데이터를 읽는다.
    const { done, value } = await reader.read();

    // 본문을 모두 다운로드하면 반복을 마친다.
    if (done) {
      renderResponeBody(chunks);
      break;
    }

    // 청크를 저장한다.
    chunks.push(value);
    // 응답 본문의 누적 길이를 갱신한다.
    receivedLength = receivedLength + value.length;

    renderProgress(receivedLength, totalLength);
  }

  // 업로드
  // 입력한 파일을 폼데이터로 구성한다.
  const formData = new FormData();
  formData.append("file", document.querySelector("input[type=file]").files[0]);

  // xhr 객체를 준비한다.
  const xhr = new XMLHttpRequest();

  // 업로드 진행율
  let uploadProgress = 0;

  // 업로드 진행 이벤트 처리기
  const handleProgress = (event) => {
    if (event.lengthComputable) {
      // 업로드 진행율을 갱신한다.
      uploadProgress = (event.loaded / event.total) * 100;
      // 업로드 진행율을 표시한다.
      console.log(`업로드 진행율: ${uploadProgress}%`);
    }
  };
  // 업로드 이벤트(progress)를 처리한다.
  xhr.upload.addEventListener("progress", handleProgress);

  // 요청
  xhr.open("POST", "/upload");
  xhr.send(formData);
});
