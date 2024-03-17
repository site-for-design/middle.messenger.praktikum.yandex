import IndexPage from "./indexPage";
import { Connect } from "../../services/Store";

const Message = Connect(IndexPage, (state) => {
    return { currentUserId: state.user.id };
});

export default Message;
