"use strict";
import MainFrame from "./pages/MainFrame";
import { call } from "./in_workers/wasm_in_worker";

// entry function
async function main () {
  // registerSW();
  setPageContent(MainFrame);
  let str = await call("asbind", "test passed");
  console.log(str);
}

// register function
window.addEventListener("load", main);

/**
 * change page content
 * @param {HTMLElement} contentElement
 */
const setPageContent = (contentElement) => {
  const body = document.querySelector("#app");
  body.innerHTML = ""; // clear
  body.append(contentElement);
};

/* eslint-disable-next-line no-unused-vars */
const registerSW = () => {
  // Check that service workers are supported
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js").then((res) => {
      console.log("sw enabled.", res);
    });
  }
};
