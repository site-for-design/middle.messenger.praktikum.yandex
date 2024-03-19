import IndexPage from "./indexPage";
import { Connect } from "../../../services/Store";
import Message from "../../../components/Message";
import { MessageT } from "../../../components/Message/indexPage";
import Unit from "../../../components/Unit";
import convertDate from "../../../utils/convertDate";

let prevDate: string | null = null;

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

const Page = Connect(IndexPage, (state) => {
    return {
        currentChat: renderMessages(state.currentChat.messages),
    };
});
export default Page;
