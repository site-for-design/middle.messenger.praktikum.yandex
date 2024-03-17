import Block, { BlockProps, setDefaultClassName } from "../../services/Block";
import tpl from "./tpl.hbs?raw";
import "./styles.scss";

type InputFileProps = BlockProps & {
    onChange?: (e: Event, isValid: boolean) => void;
};

export default class InputFile extends Block {
    constructor(props: InputFileProps, tagName?: keyof HTMLElementTagNameMap) {
        super(setDefaultClassName(props, "file-wrap"), tagName);
    }

    componentDidMount(): void {
        if (this.props.onChange) {
            this.element
                .querySelector("input")
                ?.addEventListener("change", (e) => {
                    const target = e.target as HTMLInputElement;

                    if (target.files) {
                        const isValid = [...target.files].every((file) => {
                            if (!target.accept) {
                                return true;
                            }
                            return (
                                target.accept
                                    .replace(/\s/g, "")
                                    .split(",")
                                    .filter((accept) => {
                                        return new RegExp(
                                            accept.replace("*", ".*")
                                        ).test(file.type);
                                    }).length > 0
                            );
                        });

                        if (this?.props?.onChange) {
                            (
                                this.props
                                    .onChange as InputFileProps["onChange"]
                            )?.(e, isValid);
                        } else {
                            if (!isValid) {
                                alert("File format is invalid!");
                            }
                        }
                    }
                });
        }
    }

    render() {
        return this.compile(tpl, this.props);
    }
}
