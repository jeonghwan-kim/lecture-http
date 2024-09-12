/**
 * 새로운 요소를 추가한다.
 */
const appendNewElement = () => {
  const newElement = document.createElement("p");
  newElement.className = "content";
  newElement.textContent = "new element";
  document.body.appendChild(newElement);
};

/**
 * 광고용 트래킹 픽셀을 추가한다.
 */
const insertTrackingPixel = () => {
  const img = document.createElement("img");
  img.src = "/tracking-pixel.gif";
  img.alt = "Tracking Pixel";
  img.style.width = "1px";
  img.style.height = "1px";
  img.style.display = "none";
  document.body.appendChild(img);
};

// 문서가 로드될 때
document.addEventListener("DOMContentLoaded", () => {
  appendNewElement();
  insertTrackingPixel();
});
