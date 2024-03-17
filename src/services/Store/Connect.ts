import Block, { BlockProps } from "../Block";
import Store, { StoreState } from "./Store";

const Connect = (
    Component: typeof Block,
    mapStateToProps: (state: StoreState) => Record<string, unknown>
) => {
    return class extends Component {
        constructor(
            propsAndChildren: BlockProps = {},
            tagName?: keyof HTMLElementTagNameMap
        ) {
            const store = new Store();
            super(
                { ...propsAndChildren, ...mapStateToProps(store.getState()) },
                tagName
            );

            store.on(Store.EVENT_UPDATE, () => {
                this.setProps({ ...mapStateToProps(store.getState()) });
            });
        }
    };
};
export default Connect;
