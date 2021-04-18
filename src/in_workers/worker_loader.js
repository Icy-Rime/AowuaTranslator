const __workerInfo = {
  inited: {},
  loading: {},
  worker: {},
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * load worker only once
 * @param {string} path
 * @returns {Promise<Worker>}
 */
export async function loadWorker (path) {
  while (__workerInfo.loading[path]) {
    await sleep(50);
  }
  if (__workerInfo.inited[path]) {
    return __workerInfo.worker[path];
  }
  __workerInfo.loading[path] = true;
  const worker = new Worker(path);
  __workerInfo.worker[path] = worker;
  __workerInfo.inited[path] = true;
  __workerInfo.loading[path] = false;
  return worker;
}
