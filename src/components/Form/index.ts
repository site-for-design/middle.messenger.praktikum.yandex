import Block, { BlockProps } from "../../services/Block";
import tpl from "./tpl.hbs?raw";
import "./styles.scss";

export default class Form extends Block {
  constructor(props: BlockProps) {
    super(props, "form");
  }
  render() {
    return this.compile(tpl, this.props);
  }
}
