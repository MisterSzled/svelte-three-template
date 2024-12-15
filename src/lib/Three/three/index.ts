import * as THREE from "three";
import { getCamera, getControls } from "./engine/camera/camera";
import { getSizer } from "./engine/sizes/sizes";
import { getRenderer } from "./engine/renderer/renderer";
import { getTimer } from "./engine/timer/timer";
import { getLoader } from "./engine/loader/loader";
import GUI from "lil-gui";
import { getAnimator } from "./engine/animator/animator";

import Stats from "stats.js";
import { getPostProcessor } from "./engine/postprocessing/postprocessing";

import { conductor } from "./conductors";

import { toggleLoadedStage } from "../../stores/state";

const createScene = (canvas: HTMLCanvasElement, window: Window) => {
        // Setup
        let timer = getTimer(window);
        let sizer = getSizer(window);

        let scene = new THREE.Scene();
        let renderer = getRenderer(canvas, sizer);

        // DX
        const gui = new GUI();
        var stats = new Stats();
        stats.showPanel(0);
        document.body.appendChild(stats.dom);

        // Camera
        let camera = getCamera(scene, sizer);
        let controls = getControls(canvas, camera);

        let postprocessor = getPostProcessor(scene, camera, renderer, gui);

        // Assets
        let loader = getLoader();
        loader.load("main");

        // Animator
        let animator = getAnimator(timer, renderer, scene, camera, stats, postprocessor, controls);

        loader.on("loaded", "loader", (args) => {
                console.log("Loaded: ", args);

                toggleLoadedStage(0);
                conductor(timer, scene, camera, controls, renderer, postprocessor, loader.resources, animator, gui);
        });


        const destroy = () => {
                sizer.off("resize");
                timer.off("tick");

                scene.traverse((child) => {
                        if (child instanceof THREE.Mesh) {
                                child.geometry.dispose();

                                for (const key in child.material) {
                                        const value = child.material[key];

                                        if (value && typeof value.dispose === 'function') {
                                                value.dispose()
                                        }
                                }
                        }
                });

                controls.dispose();
                renderer.dispose();

                gui.destroy();
        };
};

export { createScene };
