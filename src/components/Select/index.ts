import Block, { BlockProps, setDefaultClassName } from "../../services/Block";
import tpl from "./tpl.hbs?raw";
import "./styles.scss";

export default class Select extends Block {
  constructor(props: BlockProps, tagName?: keyof HTMLElementTagNameMap) {
    super(setDefaultClassName(props, "select-wrap"), tagName);
  }
  render() {
    return this.compile(tpl, this.props);
  }
}
