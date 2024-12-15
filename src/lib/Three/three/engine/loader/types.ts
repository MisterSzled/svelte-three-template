import * as THREE from "three";

type GLTFResource = {
        type: "gltfModel";
        data: THREE.Group;
};

type TextureResource = {
        type: "texture";
        data: THREE.Texture;
};

type CubeTextureResource = {
        type: "cubeTexture";
        data: THREE.CubeTexture;
};

type Resource = GLTFResource | TextureResource | CubeTextureResource;

interface ResourceBundle {
        [key: string]: Resource;
}

interface Resources {
        [bundleName: string]: ResourceBundle & { ready: boolean };
}

export { GLTFResource, TextureResource, CubeTextureResource, Resource, ResourceBundle, Resources }