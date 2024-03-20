import Block, { BlockProps } from "../Block";
import { store, StoreState, EVENT_UPDATE } from "./Store";

export type BlockPropsWithStore = BlockProps & Partial<StoreState>;

export const Connect = (
    Component: typeof Block,
    mapStateToProps: (state: StoreState) => Record<string, unknown>
) => {
    return class extends Component {
        constructor(
            propsAndChildren: BlockPropsWithStore = {},
            tagName?: keyof HTMLElementTagNameMap
        ) {
            super(
                { ...propsAndChildren, ...mapStateToProps(store.getState()) },
                tagName
            );

            store.on(EVENT_UPDATE, () => {
                this.setProps({ ...mapStateToProps(store.getState()) });
            });
        }
    };
};
