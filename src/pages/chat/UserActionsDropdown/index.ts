import Dropdown from "../../../components/Dropdown";
import Unit from "../../../components/Unit";
import Image from "../../../components/Image";
import { instanceModalAddUser, instanceModalRemoveUser } from "../indexPage";

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
                                instanceModalAddUser.show();
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
                                instanceModalRemoveUser.show();
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
