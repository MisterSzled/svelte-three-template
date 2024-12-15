import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

const getPostProcessor = (scene, camera, renderer, gui) => {
        const BLOOM_SCENE = 1;
        const bloomLayer = new THREE.Layers();
        bloomLayer.set(BLOOM_SCENE);

        const params = {
                threshold: 0,
                strength: 0.2,
                radius: 0.5,
                exposure: 1
        };

        const renderScene = new RenderPass(scene, camera);

        // Bloom
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloomPass.threshold = params.threshold;
        bloomPass.strength = params.strength;
        bloomPass.radius = params.radius;

        const bloomComposer = new EffectComposer(renderer);
        bloomComposer.renderToScreen = false;
        bloomComposer.addPass(renderScene);
        bloomComposer.addPass(bloomPass);

        const mixPass = new ShaderPass(
                new THREE.ShaderMaterial({
                        uniforms: {
                                baseTexture: { value: null },
                                bloomTexture: { value: bloomComposer.renderTarget2.texture }
                        },
                        vertexShader: `
                                varying vec2 vUv;
                                void main() {
                                vUv = uv;
                                        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                                }
                        `,
                        fragmentShader: `
                                uniform sampler2D baseTexture;
                                uniform sampler2D bloomTexture;
                                varying vec2 vUv;
                                void main() {
                                        gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
                                }
                        `,
                        defines: {}
                }), 'baseTexture'
        );
        mixPass.needsSwap = true;

        // Initial
        const depthTexture = new THREE.DepthTexture();
        const renderTarget = new THREE.WebGLRenderTarget(
                window.innerWidth,
                window.innerHeight,
                {
                        depthTexture: depthTexture,
                        depthBuffer: true,
                }
        );


        // Antialias pass.
        const effectFXAA = new ShaderPass(FXAAShader);
        effectFXAA.uniforms["resolution"].value.set(
                1 / window.innerWidth,
                1 / window.innerHeight
        );

        const outputPass = new OutputPass();
        const finalComposer = new EffectComposer(renderer, renderTarget);
        finalComposer.addPass(renderScene);
        finalComposer.addPass(effectFXAA);
        finalComposer.addPass(mixPass);
        finalComposer.addPass(outputPass);


        const entityFolder = gui.addFolder('bloom');
        entityFolder.add(bloomPass, "threshold", 0, 1, 0.01).name("threshold");
        entityFolder.add(bloomPass, "strength", 0, 3, 0.01).name("strength");
        entityFolder.add(bloomPass, "radius", 0, 1, 0.01).name("radius");

        entityFolder.add(renderer, "toneMappingExposure", 0.1, 2, 0.01);

        return {
                bloomPass: bloomPass,
                bloomLayer: bloomLayer,
                bloomComposer: bloomComposer,
                finalComposer: finalComposer,
        }
}

export { getPostProcessor };