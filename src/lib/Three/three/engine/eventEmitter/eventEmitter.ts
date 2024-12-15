type Listener = (...args: any[]) => void;

interface EventMap {
        [eventName: string]: Listener;
}

interface EventEmitter {
        on(event: string, name: string, listener: Listener): void;
        emit(event: string, ...args: any[]): void;
        getEvents(event: string): EventMap | undefined;
        off(event: string): void;
        removeListener(event: string, name: string): void;
}

const createEventEmitter = (): EventEmitter => {
        const events: { [eventName: string]: EventMap } = {};

        return {
                on(event, name, listener) {
                        if (!events[event]) {
                                events[event] = {};
                        }
                        events[event][name] = listener;
                },
                emit(event, ...args) {
                        if (events[event]) {
                                for (const listener of Object.values(events[event])) {
                                        listener(...args);
                                }
                        }
                },
                getEvents(event) {
                        return events[event];
                },
                off(event) {
                        delete events[event];
                },
                removeListener(event, name) {
                        if (events[event] && events[event][name]) {
                                delete events[event][name];
                        }
                },
        };
};

export { createEventEmitter, EventEmitter };
