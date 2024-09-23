// 광고용 트래킹 픽셀을 추가하는 함수
function insertTrackingPixel() {
  const img = document.createElement("img");
  img.src = "/tracking-pixel.gif";
  img.alt = "Tracking Pixel";
  img.style.width = "1px";
  img.style.height = "1px";
  img.style.display = "none";
  document.body.appendChild(img);
  // 브라우져는 GET /tracking-pixel.gif HTTP 메시지를 서버로 보낼 것이다.
}

// 문서가 로드될 때 insertTrackingPixel을 추가합니다.
document.addEventListener("DOMContentLoaded", () => {
  console.log("script.js");
  insertTrackingPixel();
});
