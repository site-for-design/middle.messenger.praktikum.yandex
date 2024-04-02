import tpl from "./tpl.hbs?raw";
import Block from "../../../services/Block";
import { BlockPropsWithStore } from "../../../services/Store";
import ChatWS from "../../../api/ChatWS";

const chatWS = new ChatWS();
let timeout: NodeJS.Timeout;
export default class CurrentChat extends Block {
  constructor(props: BlockPropsWithStore) {
    super({
      ...props,
      events: {
        scroll: async () => {
          const nearBottom = this._element.scrollTop < 500;
          if (nearBottom) {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
              chatWS.getOldMessages();
            }, 200);
          }
        },
      },
      attrs: { class: "body" },
    });
  }

  render() {
    return this.compile(tpl, this.props);
  }
}
