import { createEventEmitter, EventEmitter } from "../eventEmitter/eventEmitter";

interface Timer extends EventEmitter {
        getElapsed: () => number;
        getDelta: () => number;
}

const getTimer = (window: Window): Timer => {
        let baseEmitter = createEventEmitter();

        let start = Date.now();
        let current = start;
        let elapsed = 0;
        let delta = 16;

        const tick = () => {
                const currentTime = Date.now();
                delta = currentTime - current;
                current = currentTime;
                elapsed = elapsed + delta;

                baseEmitter.emit('tick');

                window.requestAnimationFrame(() => {
                        tick();
                });
        };

        const getElapsed = () => elapsed;
        const getDelta = () => delta;

        window.requestAnimationFrame(() => {
                tick();
        });

        const timer: Timer = {
                ...baseEmitter,
                getElapsed,
                getDelta
        };

        return timer;
};

export { getTimer };
