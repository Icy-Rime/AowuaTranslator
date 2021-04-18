// The entry file of your WebAssembly module.
declare function consoleLog(message: string): void;

export function textToRoar(text: string, code: string): string {
  if (code.length != 4) {
    throw new Error("code incorrect.");
  }
  let offset: i32 = 0;
  let roars: Array<i32> = new Array<i32>(text.length * 8);
  for (let i: i32 = 0; i < text.length; i++) {
    let char: i32 = text.charCodeAt(i);
    for (let b: i32 = 0; b < 4; b++) {
      let hex: i32 = (i32)(char >> (4 * (3 - b))) & 0x0F;
      hex = (i32)(hex + offset) % 0x10;
      let p1: i32 = (i32)(hex / 4);
      let p2: i32 = (i32)(hex % 4);
      roars[ i * 8 + (b * 2)] = code.charCodeAt(p1);
      roars[ i * 8 + (b * 2) + 1] = code.charCodeAt(p2);
      offset ++;
    }
  }
  return String.fromCharCodes(roars);
}

export function textFromRoar(roars: string, code: string): string {
  if (code.length != 4) {
    throw new Error("code incorrect.");
  }
  const valueMap: Map<i32, i32> = new Map<i32, i32>();
  for (let i: i32 = 0; i < 4; i++) {
    valueMap.set(code.charCodeAt(i), i);
  }
  if (roars.length % 8 != 0) {
    throw new Error("text incorrect.");
  }
  const slength: i32 = (i32)(roars.length / 8);
  let offset: i32 = 0;
  let text: Array<i32> = new Array<i32>(slength);
  for (let i: i32 = 0; i < slength; i++) {
    let charCode = 0;
    for (let b: i32 = 0; b < 4; b++) {
      let char1: i32 = roars.charCodeAt(i * 8 + b * 2);
      let char2: i32 = roars.charCodeAt(i * 8 + b * 2 + 1);
      if (!valueMap.has(char1) || !valueMap.has(char2)) {
        throw new Error("code incorrect.");
      }
      let hex: i32 = valueMap.get(char1) * 4 + valueMap.get(char2);
      hex = (i32)(hex - (offset % 0x10) + 0x10) % 0x10;
      charCode = (charCode << 4) | hex;
      offset ++;
    }
    text[i] = charCode;
  }
  return String.fromCharCodes(text);
}
