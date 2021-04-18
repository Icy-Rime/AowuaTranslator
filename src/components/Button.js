import { ComponentClass } from "./ComponentClass";
import { e } from "../utils/html";

export class Button extends ComponentClass {
  /**
 * Create Button
 * @returns {ComponentClass} component instance
 */
  constructor (label = "button", onClick = undefined) {
    super();
    this.element = e("button", {
      style: {
        padding: "8px",
        borderRadius: "4px",
        borderWidth: "0",
        color: "#FFF",
        backgroundColor: "#08E",
        cursor: "pointer",
      },
    }, label);
    this.element.onclick = onClick;
  }
}

export function button (label = "button", onClick = undefined) {
  return (new Button(label, onClick)).element;
}
