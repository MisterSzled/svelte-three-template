import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/Addons.js";

export interface Timer {
    on(event: string, id: string, callback: () => void): void;
    getDelta(): number;
}

export interface PostProcessor {
    bloomLayer: THREE.Layers;
    bloomComposer: EffectComposer;
    finalComposer: EffectComposer;
}

export interface Animator {
    mixer: THREE.AnimationMixer;
}

export type BloomMaterialMap = Record<string, THREE.Material>;
