import tpl from "./tpl.hbs?raw";
import Block from "../../../services/Block";
import { RESOURCES_URL } from "../../../api/HTTPTransportYaPraktikum";
import { Connect } from "../../../services/Store";
import UserActionsDropdown from "../UserActionsDropdown";

class HeaderChat extends Block {
  constructor() {
    super(
      {
        userActions: UserActionsDropdown,
        attrs: {
          class: "header",
        },
      },
      "div",
    );
  }
  render() {
    return this.compile(tpl, this.props);
  }
}

const HeaderChatWithStore = Connect(HeaderChat, (state) => {
  return {
    name: state.currentChat?.title,
    avatar: state.currentChat?.avatar
      ? `${RESOURCES_URL}${state.currentChat?.avatar}`
      : "img/noImage.svg",
  };
});

export default HeaderChatWithStore;
