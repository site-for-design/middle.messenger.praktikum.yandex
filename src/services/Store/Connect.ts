import Block, { BlockProps } from "../Block";
import { Store, StoreState } from "./Store";

export type BlockPropsWithStore = BlockProps & Partial<StoreState>;

export const Connect = (
    Component: typeof Block,
    mapStateToProps?: (state: StoreState) => Record<string, unknown>
) => {
    return class extends Component {
        constructor(
            propsAndChildren: BlockPropsWithStore = {},
            tagName?: keyof HTMLElementTagNameMap
        ) {
            const store = new Store();
            const props = mapStateToProps
                ? mapStateToProps(store.getState())
                : store.getState();
            console.log(props);

            super({ ...propsAndChildren, ...props }, tagName);

            store.on(Store.EVENT_UPDATE, () => {
                this.setProps({ ...props });
            });
        }
    };
};
