import * as THREE from "three";

import { TweenOptions } from "../_HELPERS_/types";
import { tweenProperty } from "../_HELPERS_/tweener";

function get_camera_entity(camera: THREE.PerspectiveCamera, controls: any, timer: any) {

        const smooth_translate = (duration: number, target: THREE.Vector3, options: TweenOptions = {}): () => Promise<void> => {
                const toValue = { x: target.x, y: target.y, z: target.z };

                return tweenProperty(camera.position, 'camera_position', duration, toValue, options, timer);
        };

        const smooth_rotate = (duration: number, target: THREE.Vector3, options: TweenOptions = {}): () => Promise<void> => {
                const endQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(target.x, target.y, target.z));
                const toValue = { x: endQuaternion.x, y: endQuaternion.y, z: endQuaternion.z, w: endQuaternion.w };

                return tweenProperty(camera.rotation, 'camera_rotation', duration, toValue, options, timer);
        };

        const smooth_translate_and_lookat = (
                duration: number,
                targetPosition: THREE.Vector3,
                lookAtTarget: THREE.Vector3,
                options: TweenOptions = {}
        ): () => Promise<void> => {
                const endPosition = targetPosition.clone();

                options.onUpdate = () => camera.lookAt(lookAtTarget);
                return smooth_translate(duration, endPosition, options);
        };

        return {
                camera: camera,
                animations: {
                        "smooth_rotate": smooth_rotate,
                        "smooth_translate": smooth_translate,
                        "smooth_translate_and_lookat": smooth_translate_and_lookat,
                }
        };
}


export { get_camera_entity }