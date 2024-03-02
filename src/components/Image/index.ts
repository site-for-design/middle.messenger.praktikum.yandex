import Block, { BlockProps } from "../../services/Block";

export default class Image extends Block {
    constructor(props: BlockProps) {
        super(props, "img");
    }
    render() {
        return this._createDocumentElement("img");
    }
}
