/**
 * download file to local
 * @param {Uint8Array} data
 * @param {string} name
 */
export function save (data, name) {
  const blob = new Blob([data.buffer], {
    type: "application/octet-stream",
  });
  const a = document.createElement("a");
  a.download = name;
  a.href = URL.createObjectURL(blob);
  a.click();
}
/**
 * convert bytes to python b'...' expression
 * @param {Uint8Array} data
 * @returns {string}
 */
export function toPythonExpression (data) {
  // 32~126
  let pyByteStr = "";
  data.forEach((u8) => {
    if (u8 >= 32 && u8 <= 126) {
      if (u8 === 34 || u8 === 39 || u8 === 92) {
        pyByteStr += "\\" + String.fromCharCode(u8); // \' and \" and \\
      } else {
        pyByteStr += String.fromCharCode(u8);
      }
    } else {
      let hex = u8.toString(16);
      switch (u8) {
        case 7: pyByteStr += "\\a"; break;
        case 8: pyByteStr += "\\b"; break;
        case 9: pyByteStr += "\\t"; break;
        case 10: pyByteStr += "\\n"; break;
        case 13: pyByteStr += "\\r"; break;
        default:
          while (hex.length < 2) hex = "0" + hex;
          pyByteStr += `\\x${hex}`;
      }
    }
  });
  return `b'${pyByteStr}'`;
}
/**
 * convert bytes to base64 encoded string
 * @param {Uint8Array} data
 * @returns {string}
 */
export function toBase64 (data) {
  let str = "";
  data.forEach((byt) => { str += String.fromCharCode(byt); });
  return btoa(str);
}
/**
 * copy text to clipboard
 * @param {string} text
 * @returns {boolean}
 */
export function saveToClipboard (text) {
  const textArea = document.createElement("textarea");

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a
  // flash, so some of these are just precautions. However in
  // Internet Explorer the element is visible whilst the popup
  // box asking the user for permission for the web page to
  // copy to the clipboard.
  //
  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = "fixed";
  textArea.style.top = 0;
  textArea.style.left = 0;
  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = "2em";
  textArea.style.height = "2em";
  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;
  // Clean up any borders.
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";
  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = "transparent";
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    document.body.removeChild(textArea);
    return false;
  }
}
/**
 * open a local file. may return undefined
 * @param {string} accept
 * @param {number} [timeout=30000]
 * @returns {Promise<File|undefined>}
 */
export function openLocalFile (accept = "*/*", timeout = 30000) {
  const ip = document.createElement("input");
  ip.type = "file";
  ip.accept = accept;
  return new Promise((resolve) => {
    const timerId = setTimeout(() => {
      ip.onchange = undefined;
      resolve(undefined);
    }, timeout);
    ip.onchange = () => {
      clearTimeout(timerId);
      ip.onchange = undefined;
      const files = ip.files;
      if (files.length <= 0) {
        resolve(undefined);
        return;
      }
      const file = files[0];
      resolve(file);
    };
    ip.click();
  });
}

export function toArrayExpression (data) {
  let byteStr = "";
  data.forEach((u8, index) => {
    if (index % 8 === 0 && index !== 0) {
      byteStr += "\n";
    }
    if (index % 8 === 0) {
      byteStr += "  ";
    } else {
      byteStr += " ";
    }
    let hex = u8.toString(16);
    while (hex.length < 2) hex = "0" + hex;
    byteStr += `0x${hex},`;
  });
  return byteStr;
}
