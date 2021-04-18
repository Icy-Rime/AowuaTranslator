import { loadModule } from "./module_loader";

/** @type {Promise<any>} */
const load = loadModule("core.wasm");

self.addEventListener("message", async (e) => {
  let wasm = await load;
  try {
    var data = e.data;
    self.postMessage({
      function: data.function,
      uuid: data.uuid,
      error: null,
      return: wasm[data.function](...data.params),
    });
  } catch (err) {
    console.error(err);
    self.postMessage({
      function: data.function,
      uuid: data.uuid,
      error: err,
      return: null,
    });
  }
}, false);