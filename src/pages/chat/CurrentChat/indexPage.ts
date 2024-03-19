import tpl from "./tpl.hbs?raw";
import Block from "../../../services/Block";
import { BlockPropsWithStore, Connect, Store } from "../../../services/Store";
import ChatWS from "../../../api/ChatWS";
import Message from "../../../components/Message";
import { MessageT } from "../../../components/Message/indexPage";
import Unit from "../../../components/Unit";
import convertDate from "../../../utils/convertDate";
import ChatListModel from "../Models/ChatListModel";

let timeout: ReturnType<typeof setTimeout>;

const chatWS = new ChatWS();
let prevDate: string | null = null;
const store = new Store();

const chatListModel = new ChatListModel();
chatListModel.setChatsList();

const renderMessages = (messages: MessageT[]) => {
    return messages
        .map((item) => {
            const currentMessageDate = convertDate(item.time).dayMonth;

            const result =
                prevDate === currentMessageDate
                    ? new Message({
                          message: item,
                      })
                    : [
                          new Unit({
                              content: currentMessageDate,
                              attrs: { class: "date" },
                          }),
                          new Message({
                              message: item,
                          }),
                      ];
            prevDate = currentMessageDate;
            return result;
        })
        .flat();
};

export default class CurrentChat extends Block {
    constructor(props: BlockPropsWithStore) {
        super({
            ...props,
            attrs: { class: "body" },
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
        });
    }

    render() {
        return this.compile(tpl, this.props);
    }
}
