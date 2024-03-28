import Block, { BlockProps } from "../../services/Block";
import tpl from "./tpl.hbs?raw";
import "./styles.scss";
import convertDate from "../../utils/convertDate";

export type MessageT = {
    content: string;
    id: number;
    time: string;
    type: string;
    user_id: number;
    is_read: boolean;
};

type MessageProps = BlockProps & {
    message: MessageT;
};
export default class Message extends Block {
    constructor(props: MessageProps) {
        const { user_id, content, time, is_read } = props.message;

        const classes = [
            "message-c",
            props.currentUserId == user_id && "current-user",
            is_read && "checked",
        ]
            .filter(Boolean)
            .join(" ");

        super({
            ...props,
            message: content,
            time: convertDate(time).time,
            attrs: {
                class: classes,
            },
        });
    }
    render() {
        return this.compile(tpl, this.props);
    }
}
