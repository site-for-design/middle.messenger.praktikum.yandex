import IndexPage from "./indexPage";
import { Connect } from "../../services/Store";

const Page = Connect(IndexPage, (state) => {
    return state;
});
export default Page;
