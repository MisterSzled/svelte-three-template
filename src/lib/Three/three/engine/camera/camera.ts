import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { size_properties } from '../sizes/sizes';

export const camera_properties = {
        fov: 75
}

const getCamera = (scene: THREE.Scene, sizer: any) => {
        const camera = new THREE.PerspectiveCamera(camera_properties.fov, size_properties.width / size_properties.height, 0.1, 100);
        scene.add(camera);

        sizer.on("resize", "camera_update", () => {
                camera.aspect = size_properties.width / size_properties.height

                camera.updateProjectionMatrix();
        });

        return camera
}

const getControls = (el: HTMLCanvasElement, camera: THREE.Camera) => {
        const orbitControls = new OrbitControls(camera, el);
        orbitControls.enableDamping = true;
        orbitControls.dampingFactor = 0.1;

        camera.updateMatrix();
        orbitControls.update();

        return orbitControls
}

export { getCamera, getControls }