import Block, { BlockProps } from "../../../../services/Block";
import tpl from "./tpl.hbs?raw";
import "./styles.scss";
import { RESOURCES_URL } from "../../../../api/HTTPTransportYaPraktikum";
import { Connect } from "../../../../services/Store";

class AccountPhoto extends Block {
    constructor(props: BlockProps) {
        super(
            {
                ...props,
                attrs: {
                    class: "user-avatar",
                },
            },
            "div"
        );
    }
    render() {
        return this.compile(tpl, this.props);
    }
}
const AccountPhotoWithStore = Connect(AccountPhoto, (state) => {
    return {
        avatar: state.user?.avatar
            ? `${RESOURCES_URL}${state.user?.avatar}`
            : "img/noImage.svg",
    };
});
export default AccountPhotoWithStore;
