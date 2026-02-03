import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from 'three';

export class AssetLoader {
  constructor() {
    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new TextureLoader();
    this.cache = new Map();
  }

  async loadModel(path) {
    if (this.cache.has(path)) {
      return this.cache.get(path);
    }

    try {
      const result = await this.gltfLoader.loadAsync(path);
      this.cache.set(path, result);
      return result;
    } catch (error) {
      console.error(`Failed to load model: ${path}`, error);
      return null;
    }
  }

  async loadTexture(path) {
    if (this.cache.has(path)) {
      return this.cache.get(path);
    }

    try {
      const texture = await this.textureLoader.loadAsync(path);
      this.cache.set(path, texture);
      return texture;
    } catch (error) {
      console.error(`Failed to load texture: ${path}`, error);
      return null;
    }
  }

  clearCache() {
    this.cache.clear();
  }

  dispose() {
    this.clearCache();
  }
}
