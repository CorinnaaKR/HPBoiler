import * as THREE from 'three';
import { HomeScene } from './HomeScene.js';

export class SceneManager {
  constructor(camera) {
    this.camera = camera;
    this.scenes = new Map();
    this.currentScene = null;
    this.currentSceneName = null;
    
    this.initScenes();
  }

  initScenes() {
    this.scenes.set('home', new HomeScene());
  }

  async loadScene(sceneName) {
    const scene = this.scenes.get(sceneName);
    
    if (!scene) {
      console.error(`Scene "${sceneName}" not found`);
      return;
    }
    
    if (this.currentScene) {
      this.currentScene.dispose();
    }
    
    console.log(`Loading scene: ${sceneName}`);
    await scene.load();
    
    this.currentScene = scene;
    this.currentSceneName = sceneName;
    
    this.camera.camera.position.set(
      scene.spawnPoint.x,
      scene.spawnPoint.y,
      scene.spawnPoint.z
    );
    
    // Register collision meshes with camera for physics
    const collisionMeshes = scene.getCollisionMeshes();
    this.camera.setCollisionMeshes(collisionMeshes);
    
    console.log(`Scene ${sceneName} ready at position:`, this.camera.camera.position);
  }

  update(deltaTime) {
    if (this.currentScene) {
      this.currentScene.update(deltaTime);
    }
  }

  dispose() {
    this.scenes.forEach(scene => scene.dispose());
    this.scenes.clear();
  }
}
