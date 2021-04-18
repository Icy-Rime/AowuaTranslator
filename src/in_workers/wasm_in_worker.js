import { loadWorker } from "./worker_loader";

/** @type {Promise<Worker>} */
const load = loadWorker("wasm_worker.js");
let globalUUID = 0;
export const call = async (funName, ...params) => {
  const worker = await load;
  const uuid = globalUUID++;
  return new Promise((resolve, reject) => {
    const listener = (event) => {
      const data = event.data;
      if (data.function === funName && data.uuid === uuid){
        worker.removeEventListener("message", listener);
        if (data.error === null) {
          resolve(data.return);
        } else {
          reject(data.error);
        }
      }
    };
    worker.addEventListener("message", listener);
    const data = {
      function: funName,
      uuid,
      params,
    };
    worker.postMessage(data);
  });
};
