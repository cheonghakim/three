export default class PreventDragAndClick {
  constructor(domElement) {
    this.mouseMoved;
    let clickStartX;
    let clickStartY;
    let clickStartTime;

    domElement.addEventListener("mousedown", (evt) => {
      clickStartX = evt.clientX;
      clickStartY = evt.clientY;
      clickStartTime = Date.now();
    });

    domElement.addEventListener("mouseup", (evt) => {
      const gapX = Math.abs(evt.clientX - clickStartX);
      const gapY = Math.abs(evt.clientY - clickStartY);
      const timeGap = Date.now() - clickStartTime;
      if (gapX > 5 || gapY > 5 || timeGap > 500) this.mouseMoved = true;
      else this.mouseMoved = false;
    });
  }
}
