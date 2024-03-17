import Block, { BlockProps } from "../../../../services/Block";
import tpl from "./tpl.hbs?raw";
import "./styles.scss";
import { RESOURCES_URL } from "../../../../api/HTTPTransportYaPraktikum";

export default class AccountPhoto extends Block {
    constructor(props: BlockProps) {
        super(
            {
                ...props,
                avatar: props.avatar
                    ? `${RESOURCES_URL}${props.avatar}`
                    : "img/noImage.svg",
                attrs: {
                    class: "user-avatar",
                },
            },
            "div"
        );
    }
    render() {
        return this.compile(tpl, this.props);
    }
}
