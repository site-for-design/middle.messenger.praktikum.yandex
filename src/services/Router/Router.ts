import Route, { RouteBlock } from "./Route";

class Router {
    static _instance: InstanceType<typeof Router>;
    routes: Route[];
    history: History;
    _currentRoute: Route | null;
    _rootQuery: string;

    constructor(rootQuery: string) {
        if (Router._instance) {
            return Router._instance;
        }
        Router._instance = this;

        this.routes = [];
        this.history = window.history;
        this._currentRoute = null;
        this._rootQuery = rootQuery;
    }

    use(pathname: string, block: RouteBlock, props?: Record<string, unknown>) {
        const route = new Route(pathname, block, this._rootQuery, props);
        this.routes.push(route);
        return this;
    }

    start() {
        this._onRoute(window.location.pathname);

        window.addEventListener("popstate", () => {
            this._onRoute(window.location.pathname);
        });
    }

    private _onRoute(pathname: string) {
        const route = this.getRoute(pathname);

        if (route) {
            this._currentRoute = route;
            route.render();
        }
    }

    go(pathname: string) {
        this.history.pushState({ pathname }, "", pathname);
        this._onRoute(pathname);
    }

    back() {
        this.history.back();
    }

    forward() {
        this.history.forward();
    }

    getRoute(pathname: string) {
        return (
            this.routes.find((route) => route.match(pathname)) ??
            this.routes.find((route) => route.match("*"))
        );
    }
}
const router = new Router("#app");
export default router;
