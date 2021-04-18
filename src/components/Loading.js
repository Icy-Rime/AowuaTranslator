import { ComponentClass } from "./ComponentClass";
import { e } from "../utils/html";
const STYLE_ELEMENT_ID = "LOADING_COMPONENT_STYLE";
const global = {
  /** @type {HTMLStyleElement} */
  style: undefined,
};

function addGlobalStylesheet () {
  // add keyframe only once
  if (global.style) {
    return;
  }
  const head = document.head.children;
  for (let i = 0; i < head.length; i++) {
    const elem = head[i];
    if (elem instanceof HTMLStyleElement && elem.id === STYLE_ELEMENT_ID) {
      global.style = elem;
      return;
    }
  }
  // create stylesheet
  global.style = document.createElement("style");
  global.style.id = STYLE_ELEMENT_ID;
  global.style.innerHTML = `@keyframes changeBgColor{
    0%{
      background: lightgreen;
    }
    50%{
      background: lightblue;
    }
    100%{
      background: lightgreen;
    }
  }
  @keyframes changeBorderColor{
    0%{
      border-color: lightgreen;
    }
    50%{
      border-color: lightblue;
    }
    100%{
      border-color: lightgreen;
    }
  }
  @keyframes turn{
    0%{
      -webkit-transform: rotate(0deg);
    }
    100%{
      -webkit-transform: rotate(360deg);
    }
  }`;
  document.head.append(global.style);
}
function setElementStyleCircle (bigCircle, smallCircle) {
  bigCircle.style.cssText = `display: inline-block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin: 5px;
    position: relative;
    border:5px solid lightgreen;
    animation: turn 1s linear infinite, changeBorderColor 2s linear infinite;`;
  smallCircle.style.cssText = `display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: lightgreen;
    position: absolute;
    left: 50%;
    margin-top: -10px;
    margin-left: -10px;
    animation: changeBgColor 2s linear infinite;`;
}

export class Loading extends ComponentClass {
  constructor () {
    super();
    addGlobalStylesheet();
    this.smallCircle = e("span", {});
    this.bigCircle = e("span",
      {},
      this.smallCircle,
    );
    setElementStyleCircle(this.bigCircle, this.smallCircle);
    this.element = this.bigCircle;
  }
}
