import Block, { BlockProps, setDefaultClassName } from "../../services/Block";
import tpl from "./tpl.hbs?raw";
import "./styles.scss";

export default class Modal extends Block {
    constructor(props: BlockProps) {
        super(setDefaultClassName(props, "modal"), "div");
        this.element
            .querySelector(".overlay")
            ?.addEventListener("click", () => this.hide());
    }
    show() {
        this.element.classList.add("active");
    }
    hide() {
        this.element.classList.remove("active");
    }

    render() {
        return this.compile(tpl, this.props);
    }
}
