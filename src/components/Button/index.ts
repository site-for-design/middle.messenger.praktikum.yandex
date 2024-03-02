import Block, { BlockProps, setDefaultClassName } from "../../services/Block";
import tpl from "./tpl.hbs?raw";
import "./styles.scss";

export default class Button extends Block {
    constructor(props: BlockProps) {
        super(setDefaultClassName(props, "btn", { type: "submit" }), "button");
    }
    render() {
        return this.compile(tpl, this.props);
    }
}
