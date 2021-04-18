import { html } from "../utils/html";
import { Button, button } from "../components/Button";

const buttonObject = new Button("Buton ");
const buttonElement = button("Button 2");

const MainFrame = html`<div>
  <h1>Dragon</h1>
  <div><${buttonObject} className="mixin_class" id="mixin_button">mixin</${buttonObject}></div>
  <div><${buttonElement}></${buttonElement}></div>
</div>`;
export default MainFrame;