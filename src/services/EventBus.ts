class EventBus {
    listeners: object;

    constructor() {
        this.listeners = {};
    }

    on(event, callback) {
        //Код здесь
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event, callback) {
        //Код здесь
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${event}`);
        }
        this.listeners[event] = this.listeners[event].filter(
            (item) => item !== callback
        );
    }

    emit(event, ...args) {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${event}`);
        }
        let response;
        this.listeners[event].forEach((listener) => {
            // listener(...args);
            response = listener(...args);
        });
        return response;
    }
}

export default EventBus;
