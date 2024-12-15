import * as THREE from "three";

import { get_environment } from "../entities/environment/environment";
import { Timer } from "../engine/timer/timer";
import GUI from "lil-gui";
import { runConcurrentAnimations } from "./_HELPERS_";
import { get_camera_entity } from "../entities/camera/camera";
import { stages } from "../../../stores/state";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { PostProcessor } from "../engine/postprocessing/postprocessing";
import { Resources } from "../engine/loader/types";
import { Animator } from "../engine/animator/types";

async function conductor(
        timer: Timer,
        scene: THREE.Scene,
        camera: THREE.PerspectiveCamera,
        controls: OrbitControls,
        renderer: THREE.WebGLRenderer,
        postprocessor: PostProcessor,
        resources: Resources,
        animator: Animator,
        gui: GUI
) {
        let main_resources = resources["main"];
        renderer.toneMappingExposure = 0.001;
        postprocessor.bloomPass.strength = 0;

        let camera_entity = get_camera_entity(camera, controls, timer);
        let environment = get_environment(renderer, postprocessor, timer);

        const ambient = new THREE.AmbientLight(0xffffff);
        ambient.intensity = 0.1;

        const entityFolder = gui.addFolder('ambient');
        entityFolder.add(ambient, "intensity", 0, 1, 0.01).name("intensity");

        scene.add(ambient);

        stages.subscribe((stages) => {
                if (stages.start["0"]) {
                        let ghost = main_resources.ghost.scene;
                        ghost.position.y = -1.5;
                        scene.add(ghost);

                        const keyLight = new THREE.PointLight(0xffffff, 150000, 20);
                        keyLight.position.set(3, 3, 3);
                        scene.add(keyLight);

                        const fillLight = new THREE.PointLight(0xffffff, 80000, 20);
                        fillLight.position.set(-3, 1.5, 3);
                        scene.add(fillLight);

                        const backLight = new THREE.PointLight(0xffffff, 120000, 20);
                        backLight.position.set(0, 3, -3);
                        scene.add(backLight);

                        const focusPosition = new THREE.Vector3(0, 0, 0);
                        const cameraOffset = new THREE.Vector3(0, 2, 5);
                        camera.position.copy(focusPosition.clone().add(cameraOffset));
                        camera.lookAt(focusPosition);

                        if (controls) {
                                controls.target.copy(focusPosition);
                                controls.update();
                        }

                        const keyLightHelper = new THREE.PointLightHelper(keyLight, 0.5);
                        const fillLightHelper = new THREE.PointLightHelper(fillLight, 0.5);
                        const backLightHelper = new THREE.PointLightHelper(backLight, 0.5);
                        scene.add(keyLightHelper, fillLightHelper, backLightHelper);

                        if (main_resources.ghost.animations && main_resources.ghost.animations.length > 0) {

                                main_resources.ghost.animations.forEach((clip) => {
                                        const action = animator.mixer.clipAction(clip, ghost);
                                        action.play();
                                });
                        }
                }
        });

}

export { conductor }