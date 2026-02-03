import * as THREE from 'three';

export class Lighting {
  constructor(scene) {
    this.scene = scene;
    this.ambientLight = null;
    this.sunLight = null;
    this.init();
  }

  init() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(this.ambientLight);
    
    this.sunLight = new THREE.DirectionalLight(0xfff5e6, 0.8);
    this.sunLight.position.set(5, 10, 5);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.far = 100;
    this.scene.add(this.sunLight);
  }

  setAmbientIntensity(intensity) {
    this.ambientLight.intensity = intensity;
  }

  setSunIntensity(intensity) {
    this.sunLight.intensity = intensity;
  }

  dispose() {
    this.ambientLight.dispose();
    this.sunLight.dispose();
  }
}
