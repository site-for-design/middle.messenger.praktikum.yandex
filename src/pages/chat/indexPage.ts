import tpl from "./tpl.hbs?raw";
import Block from "../../services/Block";
import ChatPreview from "./ChatPreview";
import Unit from "../../components/Unit";
import { getChats } from "../../api/chats";
import { modalAddUser, modalCreateChat, modalRemoveUser } from "./Modals";
import ChatWS, { MESSAGES_OFFSET } from "../../api/ChatWS";
import Button from "../../components/Button";
import Form from "../../components/Form";
import "./styles.scss";
import AttachFileDropdown from "./AttachFileDropdown";
import Message from "../../components/Message";
import router from "../../services/Router/Router";
import HeaderChat from "./HeaderChat";
import { Store, setCurrentChat } from "../../services/Store";
import UserActionsDropdown from "./UserActionsDropdown";
import convertDate from "../../utils/convertDate";
import { StoreState } from "../../services/Store/Store";
import { setCurrentChatId } from "../../services/Store";
import ChatListModel from "./Models/ChatListModel";
import CurrentChat from "./CurrentChat";
import { Message as MessageT } from "../../api/types";

type ChatProps = any;

let prevDate: string | null = null;
const chatWS = new ChatWS();
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

const currentChat = new CurrentChat({
    content: store.getStateEl("currentChat")?.messages
        ? renderMessages(store.getStateEl("currentChat").messages)
        : [],
});

const connectChatWS = async (
    user: StoreState["user"],
    currentChatId: StoreState["currentChatId"]
) => {
    try {
        if (currentChatId && user) {
            await chatWS.connect(user.id, currentChatId);

            chatWS.socket.addEventListener(
                "message",
                (e: MessageEvent<unknown>) => {
                    if (e.data !== "WS token is not valid") {
                        const data = JSON.parse(String(e.data));

                        chatWS.messages = Array.isArray(data)
                            ? [...data.reverse(), ...chatWS.messages]
                            : [...chatWS.messages, data];
                        setCurrentChat({ messages: chatWS.messages });
                        // currentChat.setProps({
                        //     content:
                        //         chatWS.messages.length > 0
                        //             ? renderMessages(chatWS.messages)
                        //             : new Unit({ content: "" }),
                        // });

                        if (chatWS.messages.length <= MESSAGES_OFFSET) {
                            currentChat._element.scrollTop =
                                currentChat._element.scrollHeight;
                        }
                    } else {
                        console.error(e.data);
                    }
                }
            );
        } else {
            console.error(currentChatId);
        }
    } catch (e) {
        console.error(e);
    }
};
connectChatWS(store.getStateEl("user"), store.getStateEl("currentChatId"));

export const instanceModalAddUser = modalAddUser();
export const instanceModalRemoveUser = modalRemoveUser();
export const instanceModalCreateChat = modalCreateChat();

const renderChat = (props: ChatProps) => {
    return new Unit({
        content: props.currentChatId
            ? [
                  new HeaderChat({
                      name: props.user?.display_name || null,
                      avatar: props.user?.avatar || null,
                      userActions: UserActionsDropdown,
                  }),
                  currentChat,
                  new Form({
                      fields: [
                          AttachFileDropdown,
                          new Unit({
                              content: new Unit(
                                  {
                                      attrs: {
                                          name: "message",
                                          placeholder: "Сообщение",
                                      },
                                      events: {
                                          input: (e) => {
                                              const target =
                                                  e.target as HTMLElement;
                                              target.style.height = "5px";
                                              target.style.height =
                                                  target.scrollHeight + "px";
                                          },
                                      },
                                  },
                                  "textarea"
                              ),
                              attrs: {
                                  class: "type-text",
                              },
                          }),
                      ],
                      button: new Button({
                          text: "",
                          attrs: { class: "submit" },
                      }),
                      attrs: {
                          class: "footer",
                      },
                      events: {
                          submit: (e: SubmitEvent) => {
                              e.preventDefault();

                              const formData = new FormData(
                                  e?.target as HTMLFormElement
                              );

                              const message = (
                                  formData.get("message") as string
                              )?.trim();

                              if (message) {
                                  chatWS.sendMessage(message);
                              }

                              (e.target as HTMLFormElement).reset();
                          },
                          keydown: function (e: KeyboardEvent) {
                              if (e.shiftKey && e.key === "Enter") {
                                  e.stopPropagation();
                              } else if (e.key === "Enter") {
                                  const formData = new FormData(
                                      this as HTMLFormElement
                                  );

                                  const message = formData.get("message");

                                  if (message) {
                                      chatWS.sendMessage(message as string);
                                  }

                                  (this as HTMLFormElement).reset();

                                  e.stopPropagation();
                              }
                          },
                      },
                  }),
              ]
            : new Unit(
                  {
                      content: "Выберите чат чтобы отправить сообщение",
                      attrs: { class: "empty" },
                  },
                  "h3"
              ),
        attrs: { class: "chat" },
    });
};

const chatList = new Unit();

class Chat extends Block {
    constructor(props: ChatProps) {
        super(
            {
                accountBtn: [
                    new Unit({
                        content: "Создать чат",
                        attrs: {
                            class: "profile",
                        },
                        events: {
                            click: () => {
                                instanceModalCreateChat.show();
                            },
                        },
                    }),
                    new Unit({
                        content: "Профиль",
                        attrs: {
                            class: "profile",
                        },
                        events: {
                            click: () => {
                                router.go("/settings");
                            },
                        },
                    }),
                ],
                chatList: chatList,
                chat: renderChat(props),
                modals: [
                    instanceModalAddUser,
                    instanceModalRemoveUser,
                    instanceModalCreateChat,
                ],
                attrs: {
                    id: "chat",
                },
            },
            "section"
        );
    }
    componentDidMount = async function () {
        try {
            const data = await getChats();
            const setChatList = () => {
                const currentChatId = this.props.currentChatId;

                this.setProps({
                    chatList: data.map(
                        (chat) =>
                            new ChatPreview(
                                {
                                    name: chat.title,
                                    avatar: chat.avatar,
                                    message: chat.last_message?.content,
                                    date: chat.last_message?.time
                                        ? convertDate(chat.last_message.time)
                                              .time
                                        : null,
                                    countMessages: chat.unread_count,
                                    events: {
                                        click: async () => {
                                            router.go(
                                                `/messenger?chatId=${chat.id}`
                                            );
                                            setCurrentChatId(chat.id);

                                            await connectChatWS(
                                                this.props.user,
                                                this.props.currentChatId
                                            );

                                            this.setProps({
                                                chat: renderChat({
                                                    user: this.props
                                                        .user as ChatProps["user"],
                                                    currentChatId: this.props
                                                        .currentChatId as ChatProps["currentChatId"],
                                                    currentChat: this.props
                                                        .currentChat as ChatProps["currentChat"],
                                                }),
                                            });

                                            setChatList();
                                        },
                                    },
                                    attrs: {
                                        class: [
                                            "chat-list__item",
                                            chat.id === currentChatId
                                                ? "active"
                                                : "",
                                        ].join(" "),
                                    },
                                },
                                "li"
                            )
                    ),
                });
            };
            setChatList();
        } catch (e) {
            console.error(e);
        }
    };
    render() {
        return this.compile(tpl, this.props);
    }
}

export default Chat;
