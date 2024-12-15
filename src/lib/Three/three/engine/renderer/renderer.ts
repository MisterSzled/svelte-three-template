import * as THREE from 'three';
import { size_properties } from '../sizes/sizes';

const getRenderer = (canvas: HTMLCanvasElement, sizer: any) => {
        let renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas, alpha: true });
        renderer.setSize(size_properties.width, size_properties.height);
        renderer.setPixelRatio(size_properties.pixelRatio);

        sizer.on("resize", "renderer", () => {
                renderer.setSize(size_properties.width, size_properties.height);
                renderer.setPixelRatio(size_properties.pixelRatio);
        });

        renderer.toneMapping = THREE.ReinhardToneMapping;

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        renderer.physicallyCorrectLights = true;
        renderer.antialias = true;
        

        return renderer;
}

export { getRenderer }