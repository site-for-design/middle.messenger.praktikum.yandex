import Block, { BlockProps } from "../../../../services/Block";
import tpl from "./tpl.hbs?raw";
import "./styles.scss";

export default class AccountPhoto extends Block {
    constructor(props: BlockProps) {
        super(
            {
                ...props,
                src: "img/noImage.svg",
                attrs: {
                    class: "image",
                },
            },
            "div"
        );
    }
    render() {
        return this.compile(tpl, this.props);
    }
}
