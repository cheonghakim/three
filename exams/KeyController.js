export default class KeyController {
  constructor() {
    this.keys = [];
    window.addEventListener("keydown", (evt) => {
      console.log(evt);
      this.keys[evt.code] = true;
    });

    window.addEventListener("keyup", (evt) => {
      delete this.keys[evt.code];
    });
  }
}
