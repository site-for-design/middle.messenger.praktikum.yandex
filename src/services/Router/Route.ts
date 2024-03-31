import Block from "../Block";

function isEqual(lhs: unknown, rhs: unknown) {
  return lhs === rhs;
}

function render(query: string, block: Block) {
  const root = document.querySelector(query);
  if (root) {
    root.innerHTML = "";
    root.appendChild(block.getContent());
  }
  return root;
}

type RouteProps = Record<string, unknown>;

export type RouteBlock = new (props?: RouteProps) => Block;

export default class Route {
  _pathname: string;
  _blockClass: RouteBlock;
  _block: InstanceType<RouteBlock> | null;
  _rootQuery: string;
  _props?: RouteProps;

  constructor(
    pathname: string,
    view: RouteBlock,
    rootQuery: string,
    props?: RouteProps,
  ) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._rootQuery = rootQuery;
    this._props = props;
  }

  navigate(pathname: string) {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave() {
    if (this._block) {
      this._block.hide();
    }
  }

  match(pathname: string) {
    return isEqual(pathname.split("?")[0], this._pathname);
  }

  render() {
    if (!this._block) {
      this._block = new this._blockClass(this._props);
    }
    render(this._rootQuery, this._block);
    return;
  }
}
