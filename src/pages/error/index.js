import { compile } from "handlebars";
import tpl from "./tpl.hbs?raw";
import "./styles.scss";

export default (props = {}) => {
 const script = () => {};

 return {
  html: compile(tpl)(props),
  js: script,
 };
};
