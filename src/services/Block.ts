import { v4 } from "uuid";
import Handlebars from "handlebars";
import EventBus from "./EventBus";
import isEqual from "../helpers/isEqual";

type Events = Record<string, (e: Event | never) => void>;
type ObjectT = Record<string, unknown>;

export type BlockProps = ObjectT & {
    events?: Events;
    attrs?: {
        class?: string;
    } & Record<string, string>;
};

export const setDefaultClassName = (
    props: BlockProps,
    className: string,
    attrs?: BlockProps
) => {
    return Object.assign(props, {
        attrs: {
            ...props.attrs,
            ...attrs,
            class: [className, props?.attrs?.class].filter(Boolean).join(" "),
        },
    });
};

export default class Block {
    static EVENTS = {
        INIT: "init",
        FLOW_CDM: "flow:component-did-mount",
        FLOW_RENDER: "flow:render",
        FLOW_CDU: "flow:component-did-update",
    };

    tagName: keyof HTMLElementTagNameMap;
    props: BlockProps;
    children: ObjectT;
    lists: ObjectT;
    eventBus: EventBus;
    _element: HTMLElement;
    _id: string;

    constructor(
        propsAndChildren: BlockProps = {},
        tagName: keyof HTMLElementTagNameMap = "div"
    ) {
        this.tagName = tagName;
        const { props, children, lists } = this._getChildren(propsAndChildren);
        this._id = v4();

        this.props = this._makeProxy({ ...props, _id: this._id });
        this.children = this._makeProxy(children);
        this.lists = this._makeProxy(lists);

        this.eventBus = new EventBus();

        this._registerEvents(this.eventBus);
        this.eventBus.emit(Block.EVENTS.INIT);
    }

    get element() {
        return this._element;
    }

    private _registerEvents(eventBus: EventBus) {
        eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    }

    _getChildren(propsAndChildren: ObjectT) {
        const props: ObjectT = {};
        const children: Record<string, Block> = {};
        const lists: ObjectT = {};

        Object.entries(propsAndChildren).forEach(([key, value]) => {
            if (value instanceof Block) {
                children[key] = value;
            } else if (
                Array.isArray(value) &&
                value.find((val) => val instanceof Block)
            ) {
                // если массив пустой то он пойдет в пропсы, по этому надо оборачивать в Unit пустой список компонентов
                lists[key] = value;
            } else {
                props[key] = value;
            }
        });

        return { props, children, lists };
    }

    compile(template: string, props?: BlockProps) {
        const propsAndStubs = props ? { ...props } : { ...this.props };

        Object.entries(this.children).forEach(
            ([key, child]: [string, Block]) => {
                propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
            }
        );
        Object.keys(this.lists).forEach((key) => {
            propsAndStubs[key] = `<div data-id="${key}"></div>`;
        });

        const fragment = this.createDocumentElement(
            "template"
        ) as HTMLTemplateElement;

        fragment.innerHTML = Handlebars.compile(template)(propsAndStubs);

        Object.values(this.children).forEach((child: Block) => {
            const stub = fragment.content.querySelector(
                `[data-id="${child._id}"]`
            );

            stub?.replaceWith(child.getContent());
        });

        Object.entries(this.lists).forEach(([key, item]: [string, Block[]]) => {
            const stub = fragment.content.querySelector(`[data-id="${key}"]`);

            if (!stub) {
                return;
            }

            const listContent = this.createDocumentElement(
                "template"
            ) as HTMLTemplateElement;
            item.forEach((item) => {
                listContent.content.appendChild(item.getContent());
            });
            stub.replaceWith(listContent.content);
        });

        return fragment.content;
    }

    setAttributes() {
        if (this.props.attrs) {
            Object.entries(this.props.attrs).forEach(
                ([key, value]: [string, string]) => {
                    this.element.setAttribute(key, value);
                }
            );
        }
    }

    private _createResources() {
        const el = this.createDocumentElement(this.tagName);
        this._element = el;
    }

    init() {
        this._createResources();
        this.eventBus.emit(Block.EVENTS.FLOW_RENDER);

        setTimeout(() => {
            this.eventBus.emit(Block.EVENTS.FLOW_CDM);
        });
    }

    // refresh() {
    //     this.eventBus.emit(Block.EVENTS.FLOW_RENDER);

    //     setTimeout(() => {
    //         this.eventBus.emit(Block.EVENTS.FLOW_CDM);
    //     });
    // }

    private _componentDidMount() {
        this.componentDidMount();

        Object.values(this.children).forEach((child: Block) => {
            child.dispatchComponentDidMount();
        });
    }

    componentDidMount() {}

    private dispatchComponentDidMount() {
        this.eventBus.emit(Block.EVENTS.FLOW_CDM);
    }

    private _componentDidUpdate(oldProps: BlockProps, newProps: BlockProps) {
        if (!isEqual(oldProps, newProps)) {
            this.componentDidUpdate();
            this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
            return true;
        }

        return false;
    }

    // Может переопределять пользователь, необязательно трогать
    componentDidUpdate() {}

    setProps = (newProps: BlockProps) => {
        if (!newProps) {
            return;
        }
        const { props, children, lists } = this._getChildren(newProps);

        if (Object.values(props).length && !isEqual(this.props, props)) {
            this.props = Object.assign(this.props, props);
        }
        if (
            Object.values(children).length &&
            !isEqual(this.children, children)
        ) {
            this.children = Object.assign(this.children, children);
        }
        if (Object.values(lists).length && !isEqual(this.lists, lists)) {
            this.lists = Object.assign(this.lists, lists);
        }
    };

    private _render() {
        const block = this.render();
        this._removeEvents();

        if (this.tagName !== "img") {
            this._element.innerHTML = "";
            this._element.appendChild(block);
        } else {
            this._element = block as HTMLElement;
        }

        this.setAttributes();

        this._addEvents();
    }

    // Может переопределять пользователь, необязательно трогать
    render(): HTMLElement | DocumentFragment {
        return this.compile("");
    }

    removeEvents() {}

    private _removeEvents() {
        const { events } = this.props;
        if (events) {
            Object.keys(events).forEach((eventName) => {
                this._element.removeEventListener(eventName, events[eventName]);
            });
        }
    }

    addEvents() {}

    private _addEvents() {
        const { events = {} } = this.props;
        if (events) {
            Object.keys(events).forEach((eventName) => {
                this._element.addEventListener(eventName, events[eventName]);
            });
        }

        this.addEvents();
    }

    private _makeProxy(props: ObjectT) {
        const handleEventBus = (oldValue: ObjectT, newValue: ObjectT) => {
            this.eventBus.emit(Block.EVENTS.FLOW_CDU, [oldValue, newValue]);
        };

        const proxy = new Proxy(props, {
            get(target, prop: string) {
                const value = target[prop];
                return typeof value === "function" ? value.bind(target) : value;
            },
            set(target, prop: string, value) {
                const oldValue: ObjectT = { ...target };

                target[prop] = value;

                handleEventBus(oldValue, target);

                return true;
            },
        });

        return proxy;
    }

    createDocumentElement(tagName?: keyof HTMLElementTagNameMap): HTMLElement {
        return document.createElement(tagName ?? "div");
    }

    getContent() {
        return this.element;
    }

    show() {
        this.element.style.display = "block";
    }

    hide() {
        this.element.style.display = "none";
    }
}
