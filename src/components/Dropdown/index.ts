import Block, { BlockProps, setDefaultClassName } from "../../services/Block";
import tpl from "./tpl.hbs?raw";
import "./styles.scss";

type DropdownProps = BlockProps & {
    icon: Block | string;
    dropdown: Block;
};
export default class Dropdown extends Block {
    constructor(props: DropdownProps) {
        super(setDefaultClassName(props, "dropdown"), "div");
    }
    render() {
        return this.compile(tpl, this.props);
    }
}
