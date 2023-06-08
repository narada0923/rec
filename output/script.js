"use strict";
class AnimationApplication {
    constructor() {
        this.scrollArea = document.querySelector("#rect_area");
        console.log(this.scrollArea);
        this.scrollArea.addEventListener("scroll", this.onScroll.bind(this));
    }
    onScroll(e) {
        console.log(e);
    }
    onClick(e) {
        console.log(e);
    }
}
new AnimationApplication();
