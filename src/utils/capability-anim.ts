
export const capabilityAnimation = () => {
  if (document.querySelectorAll(".capability-hover-active").length > 0) {
    const boxes = document.querySelectorAll<HTMLDivElement>(".capability-hover-active .capability-box");

    boxes.forEach((box) => {
      box.addEventListener("mouseover", () => {
        boxes.forEach((sibling) => sibling.classList.remove("active"));
        box.classList.add("active");
      });
    });
  }
}
