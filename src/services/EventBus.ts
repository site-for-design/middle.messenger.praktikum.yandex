class EventBus {
    listeners: Record<string, Function[]>;

    constructor() {
        this.listeners = {};
    }

    on(event: string, callback: Function) {
        //Код здесь
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event: string, callback: Function) {
        //Код здесь
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${event}`);
        }
        this.listeners[event] = this.listeners[event].filter(
            (item) => item !== callback
        );
    }

    emit(event: string, ...args: any) {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${event}`);
        }
        let response;
        this.listeners[event].forEach((listener: Function) => {
            // listener(...args);
            response = listener(...args);
        });
        return response;
    }
}

export default EventBus;
