import * as THREE from 'three';
import * as TWEEN from "@tweenjs/tween.js";

let ENABLE_BLOOM = 0;

function getAnimator(timer: any, renderer: any, scene: any, camera: any, stats: any, postprocessor: any, controls: any) {
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

function animate(timer: any, renderer: THREE.Renderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, postprocessor: any, controls: any, mixer: any) {
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
