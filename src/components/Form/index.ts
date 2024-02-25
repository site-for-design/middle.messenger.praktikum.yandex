import Block from "../../services/Block";
import tpl from "./tpl.hbs?raw";
import "./styles.scss";

// Type FormProps = {
// 	title: string;
// 	fields: any[];
// 	button: Block;
// 	footer: any;
// };

export default class Form extends Block {
    render() {
        return this.compile(tpl, this.props);
    }
}
