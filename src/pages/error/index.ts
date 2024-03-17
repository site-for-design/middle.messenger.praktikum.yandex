import Block from "../../services/Block";
import tpl from "./tpl.hbs?raw";
import "./styles.scss";

export default class Error extends Block {
    render() {
        return this.compile(tpl, this.props);
    }
}
