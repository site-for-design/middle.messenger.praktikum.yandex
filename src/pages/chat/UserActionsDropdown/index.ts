import Dropdown from "../../../components/Dropdown";
import Unit from "../../../components/Unit";
import Image from "../../../components/Image";
import ModalRemoveUser from "../Modals/ModalRemoveUser";
import ModalAddUser from "../Modals/ModalAddUser";
import ModalChangeAvatar from "../Modals/ModalChangeAvatar";
import ModalRemoveChat from "../Modals/ModalRemoveChat";

const UserActionsDropdown = new Dropdown({
    icon: new Image({
        attrs: {
            src: "img/actions.svg",
            alt: "Добавить/Удалить пользователя",
        },
    }),
    dropdown: new Unit(
        {
            content: [
                new Unit(
                    {
                        content: [
                            new Image({
                                attrs: {
                                    src: "img/photo&video.svg",
                                    alt: "Изменить фото чата",
                                },
                            }),
                            new Unit(
                                {
                                    content: "Изменить фото чата",
                                },
                                "span"
                            ),
                        ],
                        events: {
                            click: async () => {
                                ModalChangeAvatar.show();
                            },
                        },
                    },
                    "li"
                ),
                new Unit(
                    {
                        content: [
                            new Image({
                                attrs: {
                                    src: "img/add.svg",
                                    alt: "Добавить пользователя",
                                },
                            }),
                            new Unit(
                                {
                                    content: "Добавить пользователя",
                                },
                                "span"
                            ),
                        ],
                        events: {
                            click: () => {
                                ModalAddUser.show();
                            },
                        },
                    },
                    "li"
                ),
                new Unit(
                    {
                        content: [
                            new Image({
                                attrs: {
                                    src: "img/remove.svg",
                                    alt: "Удалить пользователя",
                                },
                            }),
                            new Unit(
                                {
                                    content: "Удалить пользователя",
                                },
                                "span"
                            ),
                        ],
                        events: {
                            click: async () => {
                                ModalRemoveUser.show();
                            },
                        },
                    },
                    "li"
                ),
                new Unit(
                    {
                        content: [
                            new Image({
                                attrs: {
                                    src: "img/remove.svg",
                                    alt: "Удалить чат",
                                },
                            }),
                            new Unit(
                                {
                                    content: "Удалить чат",
                                },
                                "span"
                            ),
                        ],
                        events: {
                            click: async () => {
                                ModalRemoveChat.show();
                            },
                        },
                    },
                    "li"
                ),
            ],
        },
        "ul"
    ),
});
export default UserActionsDropdown;
