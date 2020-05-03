/*https://discourse.wicg.io/t/drag-to-scroll-a-simple-way-to-scroll-sideways-on-desktop/3627*/

// app.innerHTML = `
// <div class="scroll" style="overflow-y: auto; cursor: pointer;">
// <div style="display: flex;width: 2000px">
//   Sideways content
// </div>
// </div>`;

const slider = document.querySelector(".scroll");
console.log(slider)
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener("mousedown", e => {
  isDown = true;
  slider.classList.add("active");
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});
slider.addEventListener("mouseleave", () => {
  isDown = false;
  slider.classList.remove("active");
});
slider.addEventListener("mouseup", () => {
  isDown = false;
  slider.classList.remove("active");
});
slider.addEventListener("mousemove", e => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = x - startX;
  slider.scrollLeft = scrollLeft - walk;
});