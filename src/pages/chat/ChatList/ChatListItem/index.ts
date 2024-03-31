import { RESOURCES_URL } from "../../../../api/HTTPTransportYaPraktikum";
import Block, { BlockProps } from "../../../../services/Block";
import tpl from "./tpl.hbs?raw";

export default class ChatListItem extends Block {
  constructor(props: BlockProps, tagName?: keyof HTMLElementTagNameMap) {
    super(
      {
        ...props,
        avatar: props.avatar
          ? `${RESOURCES_URL}${props.avatar}`
          : "img/noImage.svg",
      },
      tagName,
    );
  }
  render() {
    return this.compile(tpl, this.props);
  }
}
