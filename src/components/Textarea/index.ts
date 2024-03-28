import Block from "../../services/Block";
import tpl from "./tpl.hbs?raw";
import "./styles.scss";

export default class Textarea extends Block {
    addEvents(): void {
        if (this.props.onChange) {
            this.element
                .querySelector("textarea")
                ?.addEventListener("input", (e) => {
                    (this.props.onChange as (e?: EventTarget) => void)(
                        e.target ?? undefined
                    );
                });
        }
    }
    render() {
        return this.compile(tpl, this.props);
    }
}
