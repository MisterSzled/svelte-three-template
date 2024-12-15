import * as THREE from "three";

import { TweenOptions } from "../_HELPERS_/types";

import { tweenProperty } from "../_HELPERS_/tweener";

function get_environment(renderer: THREE.WebGLRenderer, postprocessor: any, timer: any) {

        let toneMapExposure = (duration: number, toValue: number, options: TweenOptions = {}): () => Promise<void> => {
                return tweenProperty(
                        renderer,
                        'toneMappingExposure',
                        duration,
                        { toneMappingExposure: toValue },
                        options,
                        timer
                );
        }
        let bloomStrength = (duration: number, toValue: number, options: TweenOptions = {}): () => Promise<void> => {
                return tweenProperty(
                        postprocessor.bloomPass,
                        'bloomStrength',
                        duration,
                        { strength: toValue },
                        options,
                        timer
                );
        }

        return {
                animations: {
                        "toneMapExposure": toneMapExposure,
                        "bloomStrength": bloomStrength,
                }
        };
}

export { get_environment }