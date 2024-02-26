import Block from "../../services/Block";
import tpl from "./tpl.hbs?raw";

// Type MessagePreviewProps = {
//     name: string;
//     message: string;
//     date: string;
//     countMessages: string;
// };

export default class Input extends Block {
    render() {
        return this.compile(tpl, this.props);
    }
}
