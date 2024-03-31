import Block, { BlockProps, setDefaultClassName } from "../../services/Block";
import tpl from "./tpl.hbs?raw";
import "./styles.scss";

export default class Title extends Block {
  constructor(props: BlockProps, tagName: keyof HTMLElementTagNameMap) {
    super(setDefaultClassName(props, "title"), tagName);
  }
  render() {
    return this.compile(tpl, this.props);
  }
}
