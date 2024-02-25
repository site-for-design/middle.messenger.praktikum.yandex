import { v4 } from "uuid";
import Handlebars from "handlebars";
import EventBus from "./EventBus";

type CreatedElement = HTMLElement | HTMLTemplateElement | DocumentFragment;

export default class Block {
    static EVENTS = {
        INIT: "init",
        FLOW_CDM: "flow:component-did-mount",
        FLOW_RENDER: "flow:render",
        FLOW_CDU: "flow:component-did-update",
    };

    _meta: {
        props: Record<string, Block>;
        tagName?: keyof HTMLElementTagNameMap;
    };

    props: Record<string, Block>;
    children: Record<string, Block>;
    lists: Record<string, Block[]>;

    eventBus: () => EventBus;
    _element: CreatedElement;
    _id: string;
    events?: Record<string, unknown>;

    /** JSDoc
     * @param {string} tagName
     * @param {Object} props
     *
     * @returns {void}
     */
    constructor(propsAndChildren = {}, tagName?: keyof HTMLElementTagNameMap) {
        const eventBus = new EventBus();
        const { props, children, lists } = this._getChildren(propsAndChildren);
        this._id = v4();

        this.props = this._makeProxy({ ...props, _id: this._id });

        this._meta = {
            props,
            tagName,
        };

        this.children = children;
        this.lists = lists;
        // this.children = this._makeProxy(children);
        // this.lists = this._makeProxy(lists);

        this.eventBus = () => eventBus;

        this._registerEvents(eventBus);
        eventBus.emit(Block.EVENTS.INIT);
    }

    get element() {
        return this._element;
    }

    _registerEvents(eventBus) {
        eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    }

    _getChildren(propsAndChildren) {
        const props = {};
        const children = {};
        const lists = {};

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

    compile(template, props): DocumentFragment {
        const propsAndStubs = { ...props };

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

        Object.entries(this.lists).forEach(([key, item]) => {
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
        this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
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
        this.eventBus().emit(Block.EVENTS.FLOW_CDM);
    }

    _componentDidUpdate(oldProps, newProps) {
        const response = this.componentDidUpdate(oldProps, newProps);
        return response;
    }

    // Может переопределять пользователь, необязательно трогать
    componentDidUpdate(oldProps, newProps) {
        if (oldProps !== newProps) {
            // this._render();
            this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
            return true;
        }

        return false;
    }

    setProps = (newProps) => {
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
        // if (typeof this._element HTMLElement)
        // const s = document.createDocumentFragment()

        (this._element as HTMLElement).innerHTML = ""; // Удаляем предыдущее содержимое
        // this._element.content = "";

        this._element.appendChild(block);

        this._addEvents();

        setTimeout(() => {
            this.dispatchComponentDidMount();
        });
    }

    // Может переопределять пользователь, необязательно трогать
    render() {
        return this.compile("", {});
    }

    _removeEvents() {
        const { events = {} } = this.props;

        Object.keys(events).forEach((eventName) => {
            this._element.removeEventListener(eventName, events[eventName]);
        });
    }

    _addEvents() {
        const { events = {} } = this.props;

        Object.keys(events).forEach((eventName) => {
            this._element.addEventListener(eventName, events[eventName]);
        });
    }

    _makeProxy(props) {
        const handleEventBus = (key, value) => {
            this.eventBus().emit(Block.EVENTS.FLOW_CDU, this, {
                ...this,
                [key]: value,
            });
        };

        // Здесь необходимо правильно обновить пропсы так,
        // чтобы ещё и сделать триггер на обновление компонента через emit.

        const proxy = new Proxy(props, {
            set(target, prop, value) {
                target[prop] = value;

                handleEventBus(prop, value);

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
