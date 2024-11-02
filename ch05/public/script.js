function insertTrackingPixel() {
  const img = document.createElement("img");
  img.src = "/tracking-pixel.gif";
  img.alt = "Tracking Pixel";
  img.style.width = "1px";
  img.style.height = "1px";
  img.style.display = "none";
  document.body.appendChild(img);
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("script.js");
  insertTrackingPixel();
});
