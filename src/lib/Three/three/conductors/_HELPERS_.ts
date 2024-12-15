import * as THREE from 'three';

async function runConcurrentAnimations(...arraysOfPromises: Array<(() => Promise<void>)[]>): Promise<void> {
        try {
                await Promise.all(arraysOfPromises.map(runSequentialAnimations));
                return Promise.resolve();
        } catch (error) {
                return Promise.reject(error);
        }
}

async function runSequentialAnimations(arrayOfPromises: (() => Promise<void>)[]): Promise<void> {
        try {
                for (const promise of arrayOfPromises) {
                        await promise();
                }
                return Promise.resolve();
        } catch (error) {
                return Promise.reject(error);
        }
}

function addSurfaceIdAttributeToMesh(scene, surfaceFinder, outlines) {
        surfaceFinder.surfaceId = 0;

        scene.traverse((child) => {
                if (child.type == "Mesh") {
                        const colorsTypedArray = surfaceFinder.getSurfaceIdAttribute(child);
                        child.geometry.setAttribute(
                                "color",
                                new THREE.BufferAttribute(colorsTypedArray, 4)
                        );
                }
        });


        outlines.updateMaxSurfaceId(surfaceFinder.surfaceId + 1);
}

export { runConcurrentAnimations, addSurfaceIdAttributeToMesh };
