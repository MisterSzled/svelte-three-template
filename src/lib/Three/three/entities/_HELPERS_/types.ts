import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from "three";

export interface EntityAnimationFunction {
        (duration: number, toValue: number, options?: TweenOptions): () => Promise<void>;
}

export interface Entity {
        mesh: THREE.Mesh | THREE.InstancedMesh;
        update_id: string;
        base_updater: () => void;
        animations: {
                [animationName: string]: EntityAnimationFunction;
        };
}


export interface TweenOptions {
        easing?: any;
        isInfinite?: boolean;
        onStart?: () => void;
        onComplete?: () => void;
        onUpdate?: () => void;
}
