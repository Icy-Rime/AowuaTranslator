import htm from "htm";
import { ComponentClass } from "../components/ComponentClass";
export const html = htm.bind(e);
/**
 * Create HTMLElement
 * @param {string} tagName tag name
 * @param {HTMLElement} attr attribute
 * @param {Array<HTMLElement> | Array<string>} children children
 * @returns {HTMLElement} html element
 */
export function e (tagName, attr, ...children) {
  let elem;
  if (typeof (tagName) === "string") { elem = document.createElement(tagName); } else if (tagName instanceof ComponentClass) { elem = tagName.element; } else if (tagName instanceof HTMLElement) { elem = tagName; }
  for (const k in attr) {
    elem[k] = attr[k];
    if (k === "style") {
      for (const sk in attr.style) {
        elem.style[sk] = attr.style[sk];
      }
    }
  }
  children.forEach((child) => {
    if (child instanceof HTMLElement || typeof (child) === "string") {
      elem.append(child);
    }
  });
  return elem;
}

/**
 * Create HTMLElement Factory
 * @param {string} tagName tag name
 * @returns {(attr:HTMLElement, ...children: Array<HTMLElement> | Array<string>) => HTMLElement} function to create html element
 */
export function factory (tagName) {
  return e.bind(null, tagName);
}

/**
 * assignstyle to element
 * @param {HTMLElement} element
 * @param {object} style
 */
export function style (element, style) {
  for (const sk in style) {
    element.style[sk] = style[sk];
  }
}
