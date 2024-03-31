import Block, { BlockProps, setDefaultClassName } from "../../services/Block";
import tpl from "./tpl.hbs?raw";
import "./styles.scss";

export default class Input extends Block {
  constructor(props: BlockProps, tagName?: keyof HTMLElementTagNameMap) {
    super(setDefaultClassName(props, "input-wrap"), tagName);
  }

  addEvents(): void {
    if (this.props.onChange) {
      this.element.querySelector("input")?.addEventListener("blur", (e) => {
        (this.props.onChange as (target?: EventTarget) => void)(
          e.target ?? undefined,
        );
      });
    }
  }
  render() {
    return this.compile(tpl, this.props);
  }
}
