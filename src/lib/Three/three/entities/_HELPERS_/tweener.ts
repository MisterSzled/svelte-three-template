import * as TWEEN from "@tweenjs/tween.js";

type TweenTarget = { [key: string]: any };
type TweenValue = { [key: string]: number };

import { TweenOptions } from "./types"

const tweenProperty = (target: TweenTarget, name: string, duration: number, toValue: TweenValue, options: TweenOptions, timer: any): () => Promise<void> => {
        return () => new Promise<void>((resolve, reject) => {
                let continueLooping = true;
                let animationCompleted = false;

                const animate = (): void => {
                        if (!continueLooping) return;

                        new TWEEN.Tween(target)
                                .to(toValue, duration)
                                .easing(options.easing || TWEEN.Easing.Linear.None)
                                .onStart(() => {
                                        console.log(`${name} animation started`)
                                        if (!!options.onStart) options.onStart();
                                })
                                .onUpdate(() => {
                                        if (!!options.onUpdate) {
                                                options.onUpdate()
                                        }
                                })
                                .onComplete(() => {
                                        if (!options.isInfinite) {
                                                continueLooping = false;
                                        }
                                        if (continueLooping) {
                                                console.log(name, " looping")
                                                animate();
                                        } else {
                                                animationCompleted = true;
                                                console.log(`${name} animation completed`);
                                                if (!!options.onComplete) options.onComplete();
                                                timer.removeListener("tick", name);
                                                resolve();
                                        }
                                })
                                .start();
                };

                animate();
        });
};



export { tweenProperty }
