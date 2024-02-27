import { v4 } from "uuid";
import Handlebars from "handlebars";
import EventBus from "./EventBus";

type CreatedElement = HTMLElement | HTMLTemplateElement | DocumentFragment;

type Events = Record<string, (e: Event | never) => void>;

type ObjectT = Record<string, unknown>;

type BlockProps = ObjectT & {
    events?: Events;
};

export default class Block {
    static EVENTS = {
        INIT: "init",
        FLOW_CDM: "flow:component-did-mount",
        FLOW_RENDER: "flow:render",
        FLOW_CDU: "flow:component-did-update",
    };

    _meta: {
        props: BlockProps;
        tagName?: keyof HTMLElementTagNameMap;
    };

    props: BlockProps;
    children: ObjectT;
    lists: ObjectT;
    eventBus: EventBus;
    _element: CreatedElement;
    _id: string;

    constructor(
        propsAndChildren: BlockProps = {},
        tagName?: keyof HTMLElementTagNameMap
    ) {
        const { props, children, lists } = this._getChildren(propsAndChildren);
        this._id = v4();

        this.props = this._makeProxy({ ...props, _id: this._id });
        this._meta = {
            props,
            tagName,
        };

        this.children = children;
        this.lists = lists;

        this.eventBus = new EventBus();

        this._registerEvents(this.eventBus);
        this.eventBus.emit(Block.EVENTS.INIT);
    }

    get element() {
        return this._element;
    }

    _registerEvents(eventBus: EventBus) {
        eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    }

    _getChildren(propsAndChildren: ObjectT) {
        const props: ObjectT = {};
        const children: ObjectT = {};
        const lists: ObjectT = {};

        Object.entries(propsAndChildren).forEach(([key, value]) => {
            if (value instanceof Block) {
                children[key] = value;
            } else if (Array.isArray(value)) {
                lists[key] = value;
            } else {
                props[key] = value;
            }
        });

        return { props, children, lists };
    }

    compile(template: string, props?: BlockProps): DocumentFragment {
        const propsAndStubs = props ? { ...props } : { ...this.props };

        Object.entries(this.children).forEach(
            ([key, child]: [string, Block]) => {
                propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
            }
        );
        Object.keys(this.lists).forEach((key) => {
            propsAndStubs[key] = `<div data-id="${key}"></div>`;
        });

        const fragment = this._createDocumentElement(
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

            const listContent = this._createDocumentElement(
                "template"
            ) as HTMLTemplateElement;
            item.forEach((item) => {
                listContent.content.appendChild(item.getContent());
            });
            stub.replaceWith(listContent.content);
        });

        return fragment.content;
    }

    _createResources() {
        const { tagName } = this._meta;
        this._element = this._createDocumentElement(tagName);
    }

    init() {
        this._createResources();
        this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
    }

    _componentDidMount() {
        this.componentDidMount();

        Object.values(this.children).forEach((child: Block) => {
            child.dispatchComponentDidMount();
        });
    }

    // Может переопределять пользователь, необязательно трогать
    componentDidMount() {}

    dispatchComponentDidMount() {
        this.eventBus.emit(Block.EVENTS.FLOW_CDM);
    }

    _componentDidUpdate(oldProps: BlockProps, newProps: BlockProps) {
        const response = this.componentDidUpdate(oldProps, newProps);
        return response;
    }

    // Может переопределять пользователь, необязательно трогать
    componentDidUpdate(oldProps: BlockProps, newProps: BlockProps) {
        if (oldProps !== newProps) {
            this._render();
            // this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
            return true;
        }

        return false;
    }

    setProps = (newProps: BlockProps) => {
        if (!newProps) {
            return;
        }
        const { props, children, lists } = this._getChildren(
            Object.assign(this.props, newProps)
        );

        if (Object.values(props).length) {
            Object.assign(this.props, props);
        }
        if (Object.values(children).length) {
            Object.assign(this.children, children);
        }
        if (Object.values(lists).length) {
            Object.assign(this.lists, lists);
        }
    };

    _render() {
        const block = this.render(); // Render теперь возвращает DocumentFragment

        this._removeEvents();

        this._element.firstElementChild?.remove(); // Удаляем предыдущее содержимое

        // this._element.appendChild(this.getContent());
        this._element.appendChild(block);
        // this._element.innerHTML = block;

        this._addEvents();

        setTimeout(() => {
            this.dispatchComponentDidMount();
        });
    }

    // Может переопределять пользователь, необязательно трогать
    render() {
        return this.compile("");
    }

    _removeEvents() {
        const { events } = this.props;
        if (events) {
            Object.keys(events).forEach((eventName) => {
                this._element.removeEventListener(eventName, events[eventName]);
            });
        }
    }

    addEvents() {}

    _addEvents() {
        const { events = {} } = this.props;
        if (events) {
            Object.keys(events).forEach((eventName) => {
                const el = this._element;
                if (el.firstElementChild) {
                    el.firstElementChild.addEventListener(
                        eventName,
                        events[eventName]
                    );
                }
            });
        }

        this.addEvents();
    }

    _makeProxy(props: ObjectT) {
        const handleEventBus = (oldValue: ObjectT, newValue: ObjectT) => {
            this.eventBus.emit(Block.EVENTS.FLOW_CDU, [oldValue, newValue]);
        };

        // Здесь необходимо правильно обновить пропсы так,
        // чтобы ещё и сделать триггер на обновление компонента через emit.

        const proxy = new Proxy(props, {
            get(target, prop: string) {
                const value = target[prop];
                return typeof value === "function" ? value.bind(target) : value;
            },
            set(target, prop: string, value) {
                const oldValue: ObjectT = { ...target };
                target[prop] = value;

                // handleEventBus(prop, value);

                // const res = target.eventBus.emit(Block.EVENTS.FLOW_CDU, [
                //     oldValue,
                //     target,
                // ]);
                handleEventBus(oldValue, target);

                // this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
                return true;
            },
        });

        return proxy;
    }

    _createDocumentElement(
        tagName?: keyof HTMLElementTagNameMap
    ): CreatedElement {
        // Можно сделать метод, который через фрагменты в цикле
        // создаёт сразу несколько блоков
        // return document.createElement(tagName ?? "template");
        return tagName
            ? document.createElement(tagName ?? "template")
            : document.createDocumentFragment();
    }

    getContent() {
        return this.element;
    }
}
