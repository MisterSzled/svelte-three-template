import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createEventEmitter } from '../eventEmitter/eventEmitter';
import { Resources } from "./types";

import sources from "./sources";

const manager = new THREE.LoadingManager();
const GLTF_Loader = new GLTFLoader(manager);
const Texture_Loader = new THREE.TextureLoader(manager);
const CubeTexture_Loader = new THREE.CubeTextureLoader(manager);

const getLoader = (): {
        resources: Resources;
        load: (resourceBundleName: string) => Promise<void>;
        on: (eventName: string, id: string, callback: (args: any) => void) => void;
        emit: (eventName: string, ...args: any[]) => void;
} => {
        const baseLoader = createEventEmitter();
        const resources: Record<string, any> = {};

        const loadBundle = async (resourceBundleName: string) => {
                try {
                        manager.onStart = function (url, itemsLoaded, itemsTotal) {
                                console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
                        };

                        manager.onLoad = function () {
                                console.log('Loading complete!');
                        };

                        manager.onProgress = function (url, itemsLoaded, itemsTotal) {
                                console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
                        };

                        manager.onError = function (url) {
                                console.log('There was an error loading ' + url);
                        };

                        resources[resourceBundleName] = {};

                        const bundle_to_load = sources[resourceBundleName];

                        const loadPromises = bundle_to_load.map((source) => {
                                return new Promise<void>((resolve) => {
                                        if (source.type === 'gltfModel') {
                                                GLTF_Loader.load(source.path as string, (file) => {
                                                        resources[resourceBundleName][source.name] = file;
                                                        resolve();
                                                });
                                        } else if (source.type === 'texture') {
                                                const path = Array.isArray(source.path) ? source.path[0] : source.path;
                                                Texture_Loader.load(path, (file) => {
                                                        resources[resourceBundleName][source.name] = file;
                                                        resolve();
                                                });
                                        } else if (source.type === 'cubeTexture') {
                                                const path = Array.isArray(source.path) ? source.path : [source.path];
                                                CubeTexture_Loader.load(path, (file) => {
                                                        resources[resourceBundleName][source.name] = file;
                                                        resolve();
                                                });
                                        }
                                });
                        });

                        await Promise.all(loadPromises);
                        resources[resourceBundleName]["ready"] = true;
                        baseLoader.emit("loaded", resourceBundleName);
                } catch (error) {
                        console.error('Error loading bundle:', error);
                }
        };

        return {
                ...baseLoader,
                resources,
                load: loadBundle
        };
};

export { getLoader };
