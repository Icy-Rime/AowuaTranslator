import { html, style as applyStyle } from "../utils/html";
import { button } from "../components/Button";
import { getText } from "../utils/translate";
import { toRoar, fromRoar } from "../utils/aowua";
import overlay from "../components/Overlay";

const LOCAL_STORAGE_KEY_CODE = "config.code";
const defaultCode = localStorage.getItem(LOCAL_STORAGE_KEY_CODE) || getText("roar_code");
const onCodeChange = (event) => {
  let newCode = event.target.value;
  if (checkCode(newCode))
    localStorage.setItem(LOCAL_STORAGE_KEY_CODE, newCode);
};

const checkCode = (code) => {
  if (code.length != 4)
    return false;
  let s = new Set();
  for (let c of code) {
    s.add(c);
  }
  if (s.size != 4)
    return false;
  return true;
};

const getOriginalTextArea = () => {
  return document.querySelector("#original_text");
};

const getEncodedTextArea = () => {
  return document.querySelector("#encoded_text");
};

const getCode = () => {
  return document.querySelector("#code").value;
};

const actionEncode = async () => {
  const code = getCode();
  if (!checkCode(code)) {
    await overlay.alert(getText("please_set_correct_code"));
    return;
  }
  let closeLoading = overlay.loading();
  try {
    let roars = await toRoar(getOriginalTextArea().value, code);
    getEncodedTextArea().value = roars;
  } catch(err) {
    console.error(err);
    overlay.alert(getText("operation_failed"));
  } finally {
    closeLoading();
  }
};

const actionDecode = async () => {
  let closeLoading = overlay.loading();
  try {
    let text = await fromRoar(getEncodedTextArea().value);
    getOriginalTextArea().value = text;
  } catch(err) {
    console.error(err);
    overlay.alert(getText("operation_failed"));
  } finally {
    closeLoading();
  }
};

/* UI */ 
const style = {
  content: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    marginTop: "10px",
    color: "#03F",
    width: "100%",
    textAlign: "center",
  },
  operationBar: {
    display: "flex",
  },
  button: {
    flex: "1 1 auto",
  },
  codeSetting: {
    margin: "10px 10px 0 10px",
    padding: "5px",
    border: "dashed 1px #03F",
    borderRadius: "5px",
    textAlign: "center",
  },
  textarea: {
    height: "300px",
    margin: "10px",
    padding: "5px",
    border: "dashed 1px #03F",
    borderRadius: "5px",
    resize: "none",
  },
};
const buttonEncode = button(getText("encode"));
const buttonDecode = button(getText("decode"));
applyStyle(buttonEncode, {...style.button, marginLeft: "10px"});
applyStyle(buttonDecode, {...style.button, marginLeft: "10px", marginRight: "10px"});
const MainFrame = html`<div style=${style.content}>
  <h2 style=${style.title}>${getText("aowua_translator")}</h2>
  <input id="code" style=${style.codeSetting} value=${defaultCode} onchange=${onCodeChange}/>
  <textarea id="original_text" style=${style.textarea} placeholder=${getText("original_text")}></textarea>
  <div style=${style.operationBar}>
    <${buttonEncode} onclick=${actionEncode} />
    <${buttonDecode} onclick=${actionDecode} />
  </div>
  <textarea id="encoded_text" style=${style.textarea} placeholder=${getText("encoded_text")}></textarea>
  ${overlay.element}
</div>`;
export default MainFrame;