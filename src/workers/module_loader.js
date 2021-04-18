import { AsBind } from "as-bind";

const __moduleInfo = {
  inited: {},
  loading: {},
  modules: {},
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * load wasm only once
 * @param {string} path
 * @returns {Promise<any>}
 */
export async function loadModule (path) {
  while (__moduleInfo.loading[path]) {
    await sleep(50);
  }
  if (__moduleInfo.inited[path]) {
    return __moduleInfo.modules[path].exports;
  }
  __moduleInfo.loading[path] = true;
  const wasm = await AsBind.instantiate(fetch(path));
  __moduleInfo.modules[path] = wasm;
  __moduleInfo.inited[path] = true;
  __moduleInfo.loading[path] = false;
  return wasm.exports;
}
