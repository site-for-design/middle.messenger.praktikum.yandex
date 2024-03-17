import Block from "../../../services/Block";
import tpl from "./tpl.hbs?raw";

export default class ChatPreview extends Block {
    render() {
        return this.compile(tpl, this.props);
    }
}
