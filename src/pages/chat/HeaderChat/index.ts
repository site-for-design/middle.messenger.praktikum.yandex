import tpl from "./tpl.hbs?raw";
import Block, { BlockProps } from "../../../services/Block";
import { RESOURCES_URL } from "../../../api/HTTPTransportYaPraktikum";

type HeaderChatProps = BlockProps & {
    name: string | null;
    avatar: string | null;
};

class HeaderChat extends Block {
    constructor(props: HeaderChatProps) {
        super(
            {
                ...props,
                avatar: props.avatar
                    ? RESOURCES_URL + props.avatar
                    : "img/noImage.svg",
                attrs: {
                    class: "header",
                },
            },
            "div"
        );
    }
    render() {
        return this.compile(tpl, this.props);
    }
}

export default HeaderChat;
