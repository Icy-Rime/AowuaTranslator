import { call } from "../in_workers/wasm_in_worker";

export const toRoar = async (text, code) => {
  let roars = await call("textToRoar", text, code);
  roars = code.charAt(3) + code.charAt(1) + code.charAt(0) + roars + code.charAt(2);
  return roars;
};

export const fromRoar = async (roars) => {
  roars = roars.trim()
  let code = roars.charAt(2) + roars.charAt(1) + roars.charAt(roars.length - 1) + roars.charAt(0);
  roars = roars.substring(3, roars.length-1);
  return await call("textFromRoar", roars, code);
};