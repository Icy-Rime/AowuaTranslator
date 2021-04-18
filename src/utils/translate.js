const LOCAL_STORAGE_KEY_LOCAL = "config.local";
export const LOCAL_EN = "en";
export const LOCAL_ZH = "zh-CN";
// DICT
const dict = {
  component_overlay_confirm: {
    default: "Confirm",
    "zh-CN": "确认",
  },
  component_overlay_cancel: {
    default: "Cancel",
    "zh-CN": "取消",
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
