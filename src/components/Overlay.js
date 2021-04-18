import { e } from "../utils/html";
import { ComponentClass } from "../components/ComponentClass";
import { Loading } from "./Loading";
import { getText } from "../utils/translate";

/**
 * build dialog element
 * @param {string | HTMLElement} message
 * @param  {...string} buttons
 */
function buildDialog (message, ...buttons) {
  const buttonList = buttons.map((label, index) => {
    return e("button",
      {
        style: {
          marginLeft: index > 0 ? "8px" : "0",
          padding: "8px",
          borderRadius: "4px",
          borderWidth: "0",
          color: index > 0 ? "#000" : "#FFF",
          backgroundColor: index > 0 ? "#DDD" : "#08E",
        },
      },
      label,
    );
  });
  let msg;
  if (typeof (message) === "object" && message instanceof HTMLElement) {
    msg = message;
  } else {
    msg = e("div",
      {
        style: {
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        },
      },
      String(message),
    );
  }
  const buttonPanel = e("div",
    {
      style: {
        marginTop: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
      },
    },
    ...buttonList,
  );
  const panel = e("div",
    {
      style: {
        fontSize: "16px",
        backgroundColor: "#FFF",
        minWidth: "240px",
        maxWidth: "90vw",
        padding: "16px",
        color: "#000",
        borderRadius: "8px",
      },
    },
    msg,
    buttonPanel,
  );
  return [panel, ...buttonList];
}

/**
 * build prompt element
 * @param {string} message message
 * @param {string} defaultText message
 * @return {[HTMLElement, HTMLElement]} element,inputElement
 */
function buildPromptBody (message, defaultText = "") {
  const msgElement = e("div",
    {
      style: {
        whiteSpace: "pre-wrap",
      },
    },
    String(message),
  );
  const inputElement = e("input",
    {
      style: {
        fontSize: "1em",
        lineHeight: "1.5em",
        marginTop: "0.25em",
        borderRadius: "0.25em",
        border: "1px solid #aaa",
        padding: "0 0.5em 0 0.5em",
        width: "100%",
      },
      value: defaultText,
    },
  );
  const element = e("div",
    {},
    msgElement,
    inputElement,
  );
  return [element, inputElement];
}

/** build loading panel
 * @returns {HTMLElement}
 */
function buildLoadingOverlay () {
  return e("div",
    {
      style: {
        backgroundColor: "#FFF",
        borderRadius: "8px",
        overflow: "hidden",
        padding: "8px",
      },
    },
    (new Loading()).element,
  );
}

class Overlay extends ComponentClass {
  constructor () {
    super();
    this.container = e("div", {
      style: {
        maxWidth: "100vw",
        maxHeight: "100vh",
        overflow: "auto",
        fontSize: "16px",
      },
    },
    );
    this.element = e("div", {
      style: {
        backgroundColor: "rgba(0,0,0,0.5)",
        position: "fixed",
        width: "100vw",
        height: "100vh",
        zIndex: 999,
        overflow: "auto",
        display: "none",
        flexDirection: "column",
        alignItems: "center",
      },
    },
    e("div", {
      style: {
        height: "100%",
        display: "flex",
        alignItems: "center",
      },
    },
    this.container,
    ),
    );
  }

  show () {
    this.element.style.display = "flex";
  }

  hide () {
    this.element.style.display = "none";
  }

  // useful function
  alert (message) {
    const [panel, buttonConfirm] = buildDialog(message, getText("component_overlay_confirm"));
    this.addChild(panel);
    return new Promise((resolve) => {
      buttonConfirm.onclick = () => {
        this.removeChild(panel);
        resolve();
      };
    });
  }

  confirm (message) {
    const [panel, buttonConfirm, buttonCancel] = buildDialog(message, getText("component_overlay_confirm"), getText("component_overlay_cancel"));
    this.addChild(panel);
    return new Promise((resolve) => {
      buttonConfirm.onclick = () => {
        this.removeChild(panel);
        resolve(true);
      };
      buttonCancel.onclick = () => {
        this.removeChild(panel);
        resolve(false);
      };
    });
  }

  prompt (message, defaultText = "") {
    const [element, inputElement] = buildPromptBody(message, defaultText);
    const [panel, buttonConfirm, buttonCancel] = buildDialog(element, getText("component_overlay_confirm"), getText("component_overlay_cancel"));
    this.addChild(panel);
    return new Promise((resolve) => {
      buttonConfirm.onclick = () => {
        this.removeChild(panel);
        resolve(inputElement.value);
      };
      buttonCancel.onclick = () => {
        this.removeChild(panel);
        resolve(null);
      };
    });
  }

  /**
   * build a dialog, return a dialog object
   * @param {string|HTMLElement} body dialog content
   * @param {(event:MouseEvent)=>void|(event:MouseEvent)=>boolean|(event:MouseEvent)=>Promise} onConfirm Confirm button callback, return true to prevent dialog close, return Promise and resolve it to close dialog later
   * @param {(event:MouseEvent)=>void|(event:MouseEvent)=>boolean|(event:MouseEvent)=>Promise} onCancel Cancel button callback, return true to prevent dialog close, return Promise and resolve it to close dialog later
   * @returns {{element:HTMLElement, buttonConfirm:HTMLElement, buttonCancel:HTMLElement, show:()=>void, hide:()=>void}}
   */
  dialog (body, onConfirm, onCancel) {
    const [panel, buttonConfirm, buttonCancel] = buildDialog(body, getText("component_overlay_confirm"), getText("component_overlay_cancel"));
    const show = () => {
      this.addChild(panel);
    };
    const hide = () => {
      this.removeChild(panel);
    };
    buttonConfirm.onclick = (event) => {
      if (typeof (onConfirm) !== "function") {
        this.removeChild(panel);
        return;
      }
      const res = onConfirm(event);
      if (res instanceof Promise) {
        // return Promise and resolve to async close
        res.then(() => {
          this.removeChild(panel);
        }).catch(() => {
          // do nothing
        });
      } else if (!res) {
        // return true value to cancel close
        this.removeChild(panel);
      }
    };
    buttonCancel.onclick = (event) => {
      if (typeof (onCancel) !== "function") {
        this.removeChild(panel);
        return;
      }
      const res = onCancel(event);
      if (res instanceof Promise) {
        res.then(() => {
          this.removeChild(panel);
        }).catch(() => {});
      } else if (!res) {
        this.removeChild(panel);
      }
    };
    return { element: panel, buttonConfirm, buttonCancel, show, hide };
  }

  loading () {
    const loadinigPanel = buildLoadingOverlay();
    this.addChild(loadinigPanel);
    return () => { this.removeChild(loadinigPanel); };
  }

  // base function
  /**
   * replace overlay child
   * @param {Node} child
   */
  replaceChild (child) {
    this.container.innerHTML = "";
    this.container.appendChild(child);
    if (child) {
      this.show();
    } else {
      this.hide();
    }
  }

  addChild (child) {
    this.container.appendChild(child);
    this.show();
  }

  removeChild (child) {
    this.container.removeChild(child);
    if (this.container.childNodes.length <= 0) {
      this.hide();
    }
  }

  // advance function
}
const overlay = new Overlay();

export default overlay;
