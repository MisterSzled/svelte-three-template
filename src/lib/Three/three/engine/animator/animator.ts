import * as THREE from 'three';
import * as TWEEN from "@tweenjs/tween.js";
import { Timer } from '../timer/timer';
import Stats from "stats.js";
import { PostProcessor } from '../postprocessing/postprocessing';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { Animator } from "./types";

let ENABLE_BLOOM = 0;

function getAnimator(
        timer: Timer,
        renderer: THREE.WebGLRenderer,
        scene: THREE.Scene,
        camera: THREE.PerspectiveCamera,
        stats: Stats,
        postprocessor: PostProcessor,
        controls: OrbitControls
): Animator {
        renderer.render(scene, camera);
        const mixer = new THREE.AnimationMixer();

        timer.on("tick", "animate", () => {
                stats.begin();
                animate(timer, renderer, scene, camera, postprocessor, controls, mixer);
                TWEEN.update()
                stats.end()
        });

        return {
                mixer: mixer
        }
}

function animate(
        timer: Timer, 
        renderer: THREE.WebGLRenderer, 
        scene: THREE.Scene, 
        camera: THREE.PerspectiveCamera, 
        postprocessor: PostProcessor, 
        controls: OrbitControls, 
        mixer: THREE.AnimationMixer
) {
        controls.update();
        mixer.update(timer.getDelta() / 1000);

        if (ENABLE_BLOOM) {
                scene.traverse((obj) => darkenNonBloomed(obj, postprocessor.bloomLayer));
                postprocessor.bloomComposer.render();
                scene.traverse((obj) => restoreMaterial(obj));
                postprocessor.finalComposer.render()
        } else {
                renderer.render(scene, camera);
        }
}

const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
let materials = {}
function darkenNonBloomed(obj, bloomLayer) {
        if (obj.isMesh && bloomLayer.test(obj.layers) === false) {

                materials[obj.uuid] = obj.material;
                obj.material = darkMaterial;

        }
}

function restoreMaterial(obj) {
        if (materials[obj.uuid]) {

                obj.material = materials[obj.uuid];
                delete materials[obj.uuid];

        }
}

export { getAnimator };
