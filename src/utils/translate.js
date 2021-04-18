const LOCAL_STORAGE_KEY_LOCAL = "config.local";
export const LOCAL_EN = "en";
export const LOCAL_ZH = "zh-CN";
// DICT
const dict = {
  ["component_overlay_confirm"]: {
    default: "Confirm",
    "zh-CN": "确认",
  },
  ["component_overlay_cancel"]: {
    default: "Cancel",
    "zh-CN": "取消",
  },
  ["aowua_translator"]: {
    default: "Aowua Translator",
    "zh-CN": "兽音译者",
  },
  ["original_text"]: {
    default: "Original text",
    "zh-CN": "原始文本",
  },
  ["encoded_text"]: {
    default: "Encoded text",
    "zh-CN": "编码后的文本",
  },
  ["encode"]: {
    default: "Encode ⇊⇊",
    "zh-CN": "编码 ⇊⇊",
  },
  ["decode"]: {
    default: "⇈⇈ Decode",
    "zh-CN": "⇈⇈ 解码",
  },
  ["roar_code"]: {
    default: "roa~",
    "zh-CN": "嗷呜啊~",
  },
  ["please_set_correct_code"]: {
    default: "Please set correct code, length must be 4, and no duplicate characters.",
    "zh-CN": "请设置正确的编码，编码长度必须为4，并且没有重复字符。",
  },
  ["operation_failed"]: {
    default: "Operation failedm please check and try again.",
    "zh-CN": "操作失败，请检查后重试。",
  },
};

// utils
function getLocalStorage (name, defaultValue) {
  const value = localStorage.getItem(name);
  if (value === null) {
    return defaultValue;
  } else {
    return value;
  }
}

// translate function
const config = {
  local: getLocalStorage(LOCAL_STORAGE_KEY_LOCAL, navigator.language || navigator.userLanguage),
};

export function setLocal (local) {
  config.local = local;
  localStorage.setItem(LOCAL_STORAGE_KEY_LOCAL, local);
}

export function getText (name) {
  const item = dict[name];
  if (item === undefined) { return "[No Text]"; }
  if (item[config.local] !== undefined) {
    return item[config.local];
  } else {
    return item.default;
  }
}
