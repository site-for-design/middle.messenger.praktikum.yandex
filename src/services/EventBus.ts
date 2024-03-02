class EventBus {
    listeners: Record<string, ((...args: unknown[]) => void)[]>;

    constructor() {
        this.listeners = {};
    }

    on(event: string, callback: () => void) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event: string, callback: () => void) {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${event}`);
        }
        this.listeners[event] = this.listeners[event].filter(
            (item) => item !== callback
        );
    }

    emit(event: string, args?: unknown[]) {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${event}`);
        }
        let response;
        this.listeners[event].forEach((listener) => {
            response = args ? listener(...args) : listener();
        });
        return response;
    }
}

export default EventBus;
