import Block, { BlockProps, setDefaultClassName } from "../../services/Block";
import tpl from "./tpl.hbs?raw";
import "./styles.scss";

export default class Dropdown extends Block {
    constructor(props: BlockProps) {
        super(setDefaultClassName(props, "dropdown"), "div");
    }
    render() {
        return this.compile(tpl, this.props);
    }
}
